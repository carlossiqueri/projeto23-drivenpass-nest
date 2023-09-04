import { IsNotEmpty, IsString } from 'class-validator';

export class CreateNoteDto {
  @IsNotEmpty()
  @IsString()
  label: string;
  @IsNotEmpty()
  @IsString()
  note: string;
}
