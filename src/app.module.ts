import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LibraryModule } from './library/library.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [PrismaModule, LibraryModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
