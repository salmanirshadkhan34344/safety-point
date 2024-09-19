import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateCommentDto {
  @IsNotEmpty()
  report_id: number;

  @IsOptional()
  parent_id: number;

  @IsOptional()
  text: string;

}


export class DeleteCommentDto {
  @IsNotEmpty()
  comment_id: number;

  @IsNotEmpty()
  report_id: number;

}

export class UpdateCommentDto {

  @IsNotEmpty()
  comment_id: number;

  @IsNotEmpty()
  report_id: number;

  @IsOptional()
  text: string;

  @IsOptional()
  delete_media: boolean;

}

export class ReportCommentsPaginatedDto {

  @IsNotEmpty()
  report_id: number;

}