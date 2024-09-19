import { IsIn, IsNotEmpty, IsOptional } from 'class-validator';


export class SentMessageDto {
  @IsNotEmpty()
  receiver_id: number;

  @IsOptional()
  parent_id: number;

  @IsOptional()
  message: string;

  @IsNotEmpty()
  @IsIn(['message', 'image', 'video'])
  file_type: string;

}

export class OnlineDto {
  @IsNotEmpty()
  bool: number

  @IsNotEmpty()
  user_id: number
}
export class SeenMessageDto {

  @IsNotEmpty()
  message_id: number;

  @IsOptional()
  message: string;
}
export class DeleteMessageDto {
  @IsNotEmpty()
  message_id: number;
}

export class ClearChatDto {
  @IsNotEmpty()
  conversation_id: number;
}

export class UserWishChatDto {
  @IsNotEmpty()
  user_id: string;
}

export class FlagMessageDto {
  @IsNotEmpty()
  message_id: number;
}