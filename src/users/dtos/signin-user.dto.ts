import { IsNotEmpty, IsString } from "class-validator";

export class SinginUserDto {

    @IsString()
    @IsNotEmpty()
    username: string;

    @IsString()
    @IsNotEmpty()
    password: string;
}