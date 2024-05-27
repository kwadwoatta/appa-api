import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DeliveryStatus, WsEvents } from 'common';
import { EventEmitter } from 'events';
import { Server } from 'socket.io';
import { Delivery, DeliveryModel } from 'src/delivery';
import { StatusChangedEventDto } from './dto/status-changed.dto';
import { DeliveryUpdatedEvent } from './entities/event.entity';

@Injectable()
export class EventsService {
  private eventEmitter: EventEmitter;

  constructor(
    @InjectModel(Delivery.name)
    private readonly deliveryModel: typeof DeliveryModel,
  ) {
    this.eventEmitter = new EventEmitter();
  }

  locationChanged(dto: any) {
    console.log({ dto });

    return 'hi';

    return this.deliveryModel
      .findByIdAndUpdate(
        dto.delivery_id,
        { location: dto.location },
        { new: true },
      )
      .exec();
  }

  async statusChanged(dto: StatusChangedEventDto) {
    console.log({ dto });

    switch (dto.status) {
      case DeliveryStatus.PickedUp: {
        const update = await this.deliveryModel
          .findByIdAndUpdate(
            dto.delivery_id,
            { pickup_time: Date.now() },
            { new: true },
          )
          .exec();

        this.eventEmitter.emit('deliveryUpdated', update);
      }

      case DeliveryStatus.InTransit: {
        const update = await this.deliveryModel
          .findByIdAndUpdate(
            dto.delivery_id,
            { start_time: Date.now() },
            { new: true },
          )
          .exec();

        this.eventEmitter.emit('deliveryUpdated', update);
      }

      case DeliveryStatus.Failed:
      case DeliveryStatus.Delivered: {
        const update = await this.deliveryModel
          .findByIdAndUpdate(
            dto.delivery_id,
            { end_time: Date.now() },
            { new: true },
          )
          .exec();

        this.eventEmitter.emit('deliveryUpdated', update);
      }

      case DeliveryStatus.Open: {
      }
    }
  }

  deliveryUpdated(server: Server) {
    this.eventEmitter.on('deliveryUpdated', (update) => {
      server.emit(WsEvents.DeliveryUpdated, update as DeliveryUpdatedEvent);
    });
  }
}
