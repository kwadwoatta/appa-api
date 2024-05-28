import {
  UseFilters,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  MessageBody,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { WebsocketExceptionsFilter, WsEvents } from 'common';
import { Server, Socket } from 'socket.io';
import { LocationChangedEventDto } from './dto/location-changed.dto';
import { StatusChangedEventDto } from './dto/status-changed.dto';
import { EventsService } from './events.service';
import { WsJwtGuard } from './guards';
import { WsAuthMiddleware } from './middleware/ws.middleware';

@UseFilters(WebsocketExceptionsFilter)
@UsePipes(new ValidationPipe({ transform: true }))
@UseGuards(WsJwtGuard)
@WebSocketGateway({ namespace: 'events' })
export class EventsGateway implements OnGatewayInit {
  @WebSocketServer()
  server: Server;

  afterInit(client: Socket) {
    console.log('after init');
    client.use(WsAuthMiddleware() as any);
  }

  constructor(private readonly eventsService: EventsService) {}

  @SubscribeMessage(WsEvents.LocationChanged)
  locationChanged(@MessageBody() dto: LocationChangedEventDto) {
    return this.eventsService.locationChanged(dto, this.server);
  }

  @SubscribeMessage(WsEvents.StatusChanged)
  statusChanged(@MessageBody() dto: StatusChangedEventDto) {
    return this.eventsService.statusChanged(dto, this.server);
  }

  @SubscribeMessage(WsEvents.DeliveryUpdated)
  deliveryUpdated(@MessageBody() data): void {
    this.server.emit(
      WsEvents.DeliveryUpdated,
      JSON.parse(JSON.stringify(data)),
    );
  }

  @SubscribeMessage('message')
  handleMessage(@MessageBody() message: string): void {
    this.server.emit('message', message);
  }
}
