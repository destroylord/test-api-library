import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class BorrowBookDto {
  @ApiProperty()
  @IsString()
  memberCode: string;

  @ApiProperty()
  @IsString()
  bookCode: string;
}
