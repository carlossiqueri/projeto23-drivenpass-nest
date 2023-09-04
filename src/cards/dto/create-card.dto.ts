import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class CreateCardDto {
    @IsNotEmpty()
    @IsString()
    cardLabel: string
  @IsNotEmpty()
  @IsString()
  cardNumber: string;

  @IsNotEmpty()
  @IsString()
  cardName: string;

  @IsNotEmpty()
  @IsString()
  cvv: string;

  @IsNotEmpty()
  @IsString()
  expireDate: string;

  @IsNotEmpty()
  @IsString()
  cardPassword: string;

  @IsNotEmpty()
  @IsBoolean()
  virtual: boolean;

  @IsNotEmpty()
  @IsString()
  type: string;
}
