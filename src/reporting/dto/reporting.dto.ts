import { IsNotEmpty, IsOptional } from "class-validator";

export class createReportingDto {

    // @IsIn(['Visible', 'Hidden', 'Moderate', 'Heavy', 'Standstill', 'Minor', 'Thunder Storm', 'Heavy Rain', 'Other Side'])
    @IsOptional()
    priority: string;

    @IsOptional()
    text: string;

    @IsNotEmpty()
    is_public: boolean;

    @IsNotEmpty()
    longitude: string;

    @IsNotEmpty()
    latitude: string;

    @IsNotEmpty()
    incident_id: number;

    @IsNotEmpty()
    location: number;

    @IsOptional()
    parent_id: number;

}

export class updateReportingDto {

    @IsNotEmpty()
    id: string;

    // @IsIn(['low', 'high'])

    @IsOptional()
    priority: string;

    @IsOptional()
    text: string;

    @IsOptional()
    is_public: boolean;

    @IsOptional()
    longitude: string;

    @IsOptional()
    latitude: string;

    @IsOptional()
    incident_id: Number;

    @IsNotEmpty()
    location: Number;

}
export class GetUserPrivateReportsDto {
    @IsNotEmpty()
    user_id: string
}

export class GetReportsDto {

    @IsNotEmpty()
    user_id: number;

    @IsNotEmpty()
    latitude: string;


    @IsNotEmpty()
    longitude: string;
}

export class DeleteReportDto {
    @IsNotEmpty()
    id: number
}
export class GetReportById {
    @IsNotEmpty()
    id: number
}

export class GetPrivateReportById {
    @IsNotEmpty()
    id: number

    @IsNotEmpty()
    is_public: number
}

export class ReportReportedDto {

    @IsNotEmpty()
    reporting_id: number;

    @IsNotEmpty()
    issue: string;
}

export class FriendNotifyForReporting {
    @IsNotEmpty()
    reporting_id: number

    @IsNotEmpty()
    user_Ids: number[]
}