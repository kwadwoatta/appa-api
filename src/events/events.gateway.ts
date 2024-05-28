import {
  UnauthorizedException,
  UseFilters,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { WebsocketExceptionsFilter, WsEvents } from 'common';
import { Server, Socket } from 'socket.io';
import { Delivery, DeliveryModel } from 'src/delivery';
import { User, UserModel } from 'src/user';
import { JoinDeliveryRoomDto } from './dto/join-delivery-room.dto';
import { LeaveDeliveryRoomDto } from './dto/leave-delivery-room.dto';
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

  constructor(
    private readonly eventsService: EventsService,
    @InjectModel(User.name)
    private readonly userModel: typeof UserModel,
    @InjectModel(Delivery.name)
    private readonly deliveryModel: typeof DeliveryModel,
  ) {}

  afterInit(client: Socket) {
    client.use(WsAuthMiddleware(this.userModel) as any);
  }

  @SubscribeMessage(WsEvents.LocationChanged)
  locationChanged(@MessageBody() dto: LocationChangedEventDto) {
    return this.eventsService.locationChanged(dto, this.server);
  }

  @SubscribeMessage(WsEvents.StatusChanged)
  statusChanged(@MessageBody() dto: StatusChangedEventDto) {
    return this.eventsService.statusChanged(dto, this.server);
  }

  @SubscribeMessage(WsEvents.DeliveryUpdated)
  deliveryUpdated(@MessageBody() dto): void {
    this.server
      .to(dto.delivery_id)
      .emit(WsEvents.DeliveryUpdated, JSON.parse(JSON.stringify(dto)));
  }

  @SubscribeMessage(WsEvents.JoinDeliveryRoom)
  async joinDeliveryRoom(
    @MessageBody() dto: JoinDeliveryRoomDto,
    @ConnectedSocket() socket: Socket,
  ) {
    if (await this.isAllowedToJoinRoom(dto.delivery_id, socket)) {
      socket.join(dto.delivery_id);
    } else {
      socket.disconnect();
    }
  }

  @SubscribeMessage(WsEvents.LeaveDeliveryRoom)
  async leaveDeliveryRoom(
    @MessageBody() dto: LeaveDeliveryRoomDto,
    @ConnectedSocket() socket: Socket,
  ) {
    socket.leave(dto.delivery_id);
  }

  private isAllowedToJoinRoom = async (
    roomID: string,
    socket: Socket,
  ): Promise<boolean> => {
    if (!((socket as any).user as User)) {
      socket.disconnect();
      throw new UnauthorizedException();
    }

    const userId = ((socket as any).user as User)._id;
    const delivery = await this.deliveryModel
      .findOne({ _id: roomID, $or: [{ driver: userId }, { customer: userId }] })
      .exec();

    return !!delivery;
  };
}
