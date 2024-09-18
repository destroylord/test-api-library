import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';

const prisma = new PrismaClient();

async function seedBooks() {
  const booksData = JSON.parse(fs.readFileSync('books.json', 'utf-8'));

  for (const book of booksData) {
    await prisma.book.create({
      data: {
        code: book.code,
        title: book.title,
        author: book.author,
        stock: book.stock,
      },
    });
  }

  console.log('Books seeding completed');
}

async function seedMembers() {
  const membersData = JSON.parse(fs.readFileSync('members.json', 'utf-8'));

  for (const member of membersData) {
    await prisma.member.create({
      data: {
        code: member.code,
        name: member.name,
      },
    });
  }

  console.log('Members seeding completed');
}

async function main() {
  await seedBooks();
  await seedMembers();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
