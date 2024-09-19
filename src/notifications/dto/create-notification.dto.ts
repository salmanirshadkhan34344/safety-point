import { IsNotEmpty, IsOptional } from "class-validator";

export class CreateNotificationDto { }
export class SeenDto {
  @IsNotEmpty()
  notification_id: number;
}


export class PaginatedDto {
  @IsOptional()
  notification_id: number;
}

