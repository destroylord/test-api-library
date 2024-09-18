import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { BorrowBookDto } from './dto/borrow-book.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ReturnBookDto } from './dto/return-book.dto';

@Injectable()
export class LibraryService {
  // Logika peminjaman buku

  constructor(private readonly prisma: PrismaService) {}
  async borrowBook(borrowBookDto: BorrowBookDto) {
    const { memberCode, bookCode } = borrowBookDto;

    const member = await this.prisma.member.findUnique({
      where: { code: memberCode },
      include: { borrowedBooks: true },
    });

    if (!member) {
      throw new NotFoundException('Member not found');
    }

    // Cek penalti
    if (member.penaltyEnd && member.penaltyEnd > new Date()) {
      throw new BadRequestException(
        'Member is under penalty and cannot borrow books',
      );
    }

    // Cek jumlah buku yang dipinjam
    const borrowedCount = await this.prisma.borrowedBook.count({
      where: { memberId: member.id },
    });

    if (borrowedCount >= 2) {
      throw new BadRequestException('Member cannot borrow more than 2 books');
    }

    // Cek ketersediaan buku
    const book = await this.prisma.book.findUnique({
      where: { code: bookCode },
    });

    if (!book) {
      throw new NotFoundException('Book not found');
    }

    if (book.stock - book.borrowedCount <= 0) {
      throw new BadRequestException('Book is not available');
    }

    return this.prisma.$transaction(async (prisma) => {
      // Tambah entri di BorrowedBook
      try {
        await prisma.borrowedBook.create({
          data: {
            memberId: member.id,
            bookId: book.id,
          },
        });
      } catch (error) {
        if (error.code === 'P2002') {
          throw new BadRequestException(
            `Member ${memberCode} has already borrowed book ${bookCode}`,
          );
        } else {
          throw error;
        }
      }

      // Update jumlah buku yang dipinjam
      await prisma.book.update({
        where: { id: book.id },
        data: { borrowedCount: { increment: 1 } },
      });

      // Buat transaksi peminjaman
      await prisma.transaction.create({
        data: {
          memberId: member.id,
          bookId: book.id,
          borrowDate: new Date(),
        },
      });

      return { message: 'Book borrowed successfully' };
    });
  }

  async returnBook(returnBookDto: ReturnBookDto) {
    const { memberCode, bookCode } = returnBookDto;

    const member = await this.prisma.member.findUnique({
      where: { code: memberCode },
    });

    if (!member) {
      throw new NotFoundException('Member not found');
    }

    const book = await this.prisma.book.findUnique({
      where: { code: bookCode },
    });

    if (!book) {
      throw new NotFoundException('Book not found');
    }

    // Cari entri di BorrowedBook
    const borrowedBook = await this.prisma.borrowedBook.findFirst({
      where: {
        memberId: member.id,
        bookId: book.id,
      },
    });

    if (!borrowedBook) {
      throw new BadRequestException(
        'This member did not borrow the specified book',
      );
    }

    // Cari transaksi peminjaman yang belum dikembalikan
    const transaction = await this.prisma.transaction.findFirst({
      where: {
        memberId: member.id,
        bookId: book.id,
        returnDate: null,
      },
      orderBy: {
        borrowDate: 'desc',
      },
    });

    if (!transaction) {
      throw new BadRequestException('Transaction not found');
    }

    // Hitung selisih hari
    const now = new Date();

    // Setting Hari untuk penalti
    const borrowDate = new Date(
      transaction.borrowDate.setDate(now.getDate() - 10),
    );

    // Setting agar gak kena penalti
    // const borrowDate = new Date(transaction.borrowDate);

    const diffTime = now.getTime() - borrowDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 3600 * 24));

    // Mulai transaksi Prisma
    return this.prisma.$transaction(async (prisma) => {
      // Update transaksi dengan returnDate
      await prisma.transaction.update({
        where: { id: transaction.id },
        data: { returnDate: borrowDate },
        // data: { returnDate: now },
      });

      // Hapus entri di BorrowedBook
      await prisma.borrowedBook.delete({
        where: { id: borrowedBook.id },
      });

      // Update jumlah buku yang dipinjam
      await prisma.book.update({
        where: { id: book.id },
        data: { borrowedCount: { decrement: 1 } },
      });

      // Jika terlambat lebih dari 7 hari, berikan penalti 3 hari
      if (diffDays > 7) {
        const penaltyEnd = new Date(now); // Tanggal sekarang
        penaltyEnd.setDate(penaltyEnd.getDate() + 3); // Tambahkan 3 hari

        console.log(`Member akan kena penalti hingga: ${penaltyEnd}`);

        await prisma.member.update({
          where: { id: member.id },
          data: { penaltyEnd },
        });

        return { message: 'Book returned with penalty' };
      }

      return { message: 'Book returned successfully' };
    });
  }

  // Pengecekan buku
  async checkBooks() {
    const books = await this.prisma.book.findMany();
    return books;
  }

  // Pengecekan anggota
  async checkMembers() {
    const members = await this.prisma.member.findMany({
      include: {
        transactions: true,
      },
    });
    return members;
  }
}
