import { IsEmail, IsNotEmpty, IsOptional } from "class-validator";

export class LogInDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    password: string;

    @IsNotEmpty()
    device_token: string;
}

export class OtpDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;
}

export class PhoneNumberDto {
    @IsNotEmpty()
    phone_number: number;
}

export class ApproveOtpDto {
    @IsNotEmpty()
    otp: number;
}

export class ProfileInformationDto{


    @IsNotEmpty()
    first_name: string;

    @IsNotEmpty()
    last_name: string;

    @IsOptional()
    image: string;


}