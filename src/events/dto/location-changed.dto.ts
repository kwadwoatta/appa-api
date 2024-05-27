import { Type } from 'class-transformer';
import { IsUUID, Matches } from 'class-validator';
import { Point, WsEvents } from 'common';

export class LocationChangedEventDto {
  @Matches(WsEvents.LocationChanged)
  event: WsEvents.LocationChanged;

  @IsUUID()
  delivery_id: string;

  @Type(() => Point)
  location: Point;
}
