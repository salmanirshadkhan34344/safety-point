import { IsNotEmpty } from "class-validator";

export class SocketSeenMessageDto {

    @IsNotEmpty()
    message_id: number;

}