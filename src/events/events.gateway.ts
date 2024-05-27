import { UseFilters, UsePipes, ValidationPipe } from '@nestjs/common';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { WebsocketExceptionsFilter, WsEvents } from 'common';
import { Server } from 'socket.io';
import { LocationChangedEventDto } from './dto/location-changed.dto';
import { StatusChangedEventDto } from './dto/status-changed.dto';
import { Event } from './entities/event.entity';
import { EventsService } from './events.service';

@WebSocketGateway({ namespace: 'events' })
@UseFilters(WebsocketExceptionsFilter)
@UsePipes(new ValidationPipe({ transform: true }))
export class EventsGateway {
  @WebSocketServer()
  server: Server<any, Event>;

  constructor(private readonly eventsService: EventsService) {}

  @SubscribeMessage(WsEvents.LocationChanged)
  locationChanged(@MessageBody() dto: LocationChangedEventDto) {
    return this.eventsService.locationChanged(dto);
  }

  @SubscribeMessage(WsEvents.StatusChanged)
  statusChanged(@MessageBody() dto: StatusChangedEventDto) {
    return this.eventsService.statusChanged(dto);
  }

  @SubscribeMessage(WsEvents.DeliveryUpdated)
  deliveryUpdated() {
    return this.eventsService.deliveryUpdated(this.server);
  }
}
