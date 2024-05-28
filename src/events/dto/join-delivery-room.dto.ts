import { IsUUID, Matches } from 'class-validator';
import { WsEvents } from 'common';

export class JoinDeliveryRoomDto {
  @Matches(WsEvents.JoinDeliveryRoom)
  event: WsEvents.JoinDeliveryRoom;

  @IsUUID()
  delivery_id: string;
}
