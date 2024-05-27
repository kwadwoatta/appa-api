import { IsEnum, IsUUID, Matches } from 'class-validator';
import { DeliveryStatus, WsEvents } from 'common';

export class StatusChangedEventDto {
  @Matches(WsEvents.StatusChanged)
  event: WsEvents.StatusChanged;

  @IsUUID()
  delivery_id: string;

  @IsEnum(DeliveryStatus)
  status: DeliveryStatus;
}
