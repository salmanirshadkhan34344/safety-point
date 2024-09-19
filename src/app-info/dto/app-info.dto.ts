import { IsNotEmpty } from "class-validator";

export class SendEmailDto {

    @IsNotEmpty()
    subject: string;

    @IsNotEmpty()
    message: string;
}
