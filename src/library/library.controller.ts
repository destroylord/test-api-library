import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { LibraryService } from './library.service';
import { BorrowBookDto } from './dto/borrow-book.dto';
import { ReturnBookDto } from './dto/return-book.dto';

@Controller('library')
export class LibraryController {
  constructor(private readonly libraryService: LibraryService) {}

  @Post('borrow')
  async borrowBook(@Body() BorrowBookDto: BorrowBookDto) {
    return this.libraryService.borrowBook(BorrowBookDto);
  }

  @Post('return')
  async returnBook(@Body() ReturnBookDto: ReturnBookDto) {
    return this.libraryService.returnBook(ReturnBookDto);
  }

  @Get('books')
  async checkBooks() {
    return this.libraryService.checkBooks();
  }

  @Get('members')
  async checkMembers() {
    return this.libraryService.checkMembers();
  }
}
