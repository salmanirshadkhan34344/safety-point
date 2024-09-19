import { IsEmail, IsIn, IsNotEmpty, IsOptional, Matches } from "class-validator";
import { IsMatch } from "src/libs/helper/validators/match.decorator";
import { SearchTypeEnum } from "../../libs/enum/global.enum";

export class SignUpDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    password: string;

    @IsNotEmpty()
    confirm_password: string;

    @IsNotEmpty()
    device_token: string;

    @IsNotEmpty()
    role: string;


    @IsNotEmpty()
    longitude: string;

    @IsNotEmpty()
    latitude: string;

}

export class OtpDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;


}

export class OnlineDto {
    @IsEmail()
    @IsNotEmpty()
    bool: string;


}
export class ChangePasswordDto {
    @IsNotEmpty()
    email: string;

    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message:
            'Password must be greater or equal to 8 characters, must have at least one uppercase and lowercase alphabets, must be alphanumeric & should must contain a special character',
    })
    @IsNotEmpty()
    password: string;

    @IsNotEmpty()
    @IsMatch('password')
    confirm_password: string;

    @IsNotEmpty()
    otp: string;
}

// export class ChangePasswordDto {
//     @IsNotEmpty()
//     email: string;

//     @IsNotEmpty()
//     password: string;

//     @IsNotEmpty()
//     @IsMatch('password')
//     confirm_password: string;

//     @IsNotEmpty()
//     otp: string;
// }


export class CreateProfileDto {



    @IsNotEmpty()
    first_name: string;

    @IsNotEmpty()
    last_name: string;

    @IsNotEmpty()
    country: string;

    @IsOptional()
    city: string;

    @IsOptional()
    state: string;

    @IsNotEmpty()
    latitude: string;

    @IsNotEmpty()
    longitude: string;

    @IsOptional()
    gender: string;

    @IsOptional()
    date_of_birth: string;

    @IsOptional()
    phone_number: string;



}
export class UpdateProfileDto {

    @IsNotEmpty()
    id: string

    @IsOptional()
    first_name: string;

    @IsOptional()
    last_name: string;

    @IsOptional()
    country: string;

    @IsOptional()
    city: string;

    @IsOptional()
    state: string;

    @IsOptional()
    latitude: string;

    @IsOptional()
    longitude: string;

    @IsOptional()
    gender: string;

    @IsOptional()
    date_of_birth: string;

    @IsOptional()
    phone_number: string;

    @IsOptional()
    image: string;


}

export class savedLocationDto {
    @IsNotEmpty()
    longitude: string;

    @IsNotEmpty()
    latitude: string;

    @IsNotEmpty()
    address: string;


    @IsNotEmpty()
    title: string;

    @IsOptional()
    default_address: string;

}

export class GetUserByIdDto {
    @IsNotEmpty()
    id: number;
}

export class DeleteLocationDto {

    @IsNotEmpty()
    id: number;
}

export class DeleteAccountDto {

    @IsOptional()
    user_id: number;
}
export class GlobalSearchDto {
    @IsOptional()
    search_text: string;

    @IsOptional()
    latitude: string;

    @IsOptional()
    longitude: string;

    @IsOptional()
    incident_id: number;


    @IsIn([SearchTypeEnum.Reports, SearchTypeEnum.Users])
    @IsNotEmpty()
    type: string;


}