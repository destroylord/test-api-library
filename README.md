## Installation

1. clone this project
2. command `npm install`
3. set database and migrate using command `prisma migrate dev`
4. running project using command `npm run dev`
5. testing api, you looking swagger in `http://localhost:3000/api`
6. Last you can testing in postman or other testing api application

Note: Saya menggunakan data simulasi untuk pengembalian dalam 10 hari dan terkena sanksi, seperti ini codenya bisa cek di file `src/library/library.service.ts` pada line 147 dan 162

![Contoh SC](https://github.com/destroylord/test-api-library/blob/main/img/code-simulation-set-10days-return%20books.png)
