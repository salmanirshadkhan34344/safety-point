import { IsNotEmpty } from "class-validator";

export class ReportingLikeDisLikeDto {
    @IsNotEmpty()
    report_id: number;

}


export class CommentLikeDisLikeDto {
    @IsNotEmpty()
    comment_id: number;

}

export class SingleReportLikeDto {
    @IsNotEmpty()
    report_id: number;

}

export class SingleCommentLikesDto {

    @IsNotEmpty()
    comment_id: string;
}