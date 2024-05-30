import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DeliveryStatus, WsEvents } from 'common';
import { Server, Socket } from 'socket.io';
import { Delivery, DeliveryModel } from 'src/delivery';
import { LocationChangedEventDto } from './dto/location-changed.dto';
import { StatusChangedEventDto } from './dto/status-changed.dto';

@Injectable()
export class EventsService {
  constructor(
    @InjectModel(Delivery.name)
    private readonly deliveryModel: typeof DeliveryModel,
  ) {}

  async locationChanged(
    dto: LocationChangedEventDto,
    server: Server,
    socket: Socket,
  ) {
    const update = await this.deliveryModel
      .findOneAndUpdate(
        { _id: dto.delivery_id, driver: (socket as any).user._id },
        { location: dto.location },
        { new: true },
      )
      .exec();

    if (!update) {
      throw new InternalServerErrorException();
    }

    socket.to(dto.delivery_id).emit(WsEvents.LocationChanged, update.toJSON());
    socket.to(dto.delivery_id).emit(WsEvents.DeliveryUpdated, update.toJSON());
  }

  async statusChanged(
    dto: StatusChangedEventDto,
    server: Server,
    socket: Socket,
  ) {
    const statusUpdates = {
      [DeliveryStatus.PickedUp]: {
        status: DeliveryStatus.PickedUp,
        pickup_time: new Date(),
      },
      [DeliveryStatus.InTransit]: {
        status: DeliveryStatus.InTransit,
        start_time: new Date(),
      },
      [DeliveryStatus.Delivered]: {
        status: DeliveryStatus.Delivered,
        end_time: new Date(),
      },
      [DeliveryStatus.Failed]: {
        status: DeliveryStatus.Failed,
        end_time: new Date(),
      },
    };

    if (statusUpdates.hasOwnProperty(dto.status)) {
      const update = await this.deliveryModel
        .findOneAndUpdate(
          { _id: dto.delivery_id, driver: (socket as any).user._id },
          statusUpdates[dto.status],
          {
            new: true,
          },
        )
        .exec();

      if (!update) {
        throw new InternalServerErrorException();
      }

      socket.to(dto.delivery_id).emit(WsEvents.StatusChanged, update.toJSON());
      socket
        .to(dto.delivery_id)
        .emit(WsEvents.DeliveryUpdated, update.toJSON());
    }
  }
}
