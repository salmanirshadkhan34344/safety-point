import { IsIn, IsNotEmpty, IsOptional } from "class-validator";

export class ReportingPaginatedDto {
    @IsOptional()
    user_id: string;

}

export class BlockUsersPaginatedDto {
    @IsOptional()
    user_id: string;

}

export class UserAddressPaginatedDto {
    @IsNotEmpty()
    user_id: string;

}


export class ReportingCommentPaginatedDto {

    @IsNotEmpty()
    report_id: number;

}
export class DeleteReportPaginatedDto {

    @IsOptional()
    reported_id: number;


    @IsNotEmpty()
    report_id: number;

    @IsNotEmpty()
    @IsIn(['accept','reject'])
    status: string;

}
export class UserFriendPaginatedDto {
    @IsNotEmpty()
    user_id: string;

}

export class UpdateContentDto {
    @IsNotEmpty()
    update_key: string;

    @IsNotEmpty()
    update_value: string;
}
