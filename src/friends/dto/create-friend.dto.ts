import { IsIn, IsNotEmpty } from "class-validator";

export class CreateFriendDto {
    @IsNotEmpty()
    user_id: number;

  }
  export class UnfriendFriendDto {
    @IsNotEmpty()
    user_id: number;
    @IsNotEmpty()
    friend_id: number;

  }
  export class AcceptRejectRequestDto {

    @IsNotEmpty()
    friend_id: number;
  
    @IsNotEmpty()
    @IsIn(['accept', 'reject'])
    status: string;
  }
  
  export class CancelRequestDto {
    @IsNotEmpty()
    user_id: number;
  
    @IsNotEmpty()
    is_friend_id: number;
  }
  
  export class BlockUserDto {
    @IsNotEmpty()
    user_id: string
  }