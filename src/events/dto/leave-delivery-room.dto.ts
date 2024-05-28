import { IsUUID, Matches } from 'class-validator';
import { WsEvents } from 'common';

export class LeaveDeliveryRoomDto {
  @Matches(WsEvents.LeaveDeliveryRoom)
  event: WsEvents.LeaveDeliveryRoom;

  @IsUUID()
  delivery_id: string;
}
