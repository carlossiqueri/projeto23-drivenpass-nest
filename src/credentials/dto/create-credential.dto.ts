import { IsNotEmpty, IsString, IsUrl } from "class-validator"

export class CreateCredentialDto {
    @IsNotEmpty()
    @IsString()
    label: string

    @IsNotEmpty()
    @IsString()
    @IsUrl()
    url: string

    @IsNotEmpty()
    @IsString()
    name: string

    @IsNotEmpty()
    @IsString()
    password: string

}
