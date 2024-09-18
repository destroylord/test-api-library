import { IsString } from 'class-validator';

export class ReturnBookDto {
  @IsString()
  memberCode: string;

  @IsString()
  bookCode: string;
}
