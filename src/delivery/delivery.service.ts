import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { EventsService } from 'src/events/events.service';
import { CreateDeliveryDto } from './dto/create-delivery.dto';
import { UpdateDeliveryDto } from './dto/update-delivery.dto';
import { Delivery, DeliveryModel } from './entities/delivery.entity';

@Injectable()
export class DeliveryService {
  constructor(
    @InjectModel(Delivery.name)
    private readonly deliveryModel: typeof DeliveryModel,
    private readonly eventsService: EventsService,
  ) {}

  create(dto: CreateDeliveryDto) {
    return this.deliveryModel.create(dto);
  }

  findAll() {
    return this.deliveryModel
      .find()
      .populate([
        { path: 'package', select: '' },
        {
          path: 'driver',
          select: '-hash -createdAt -updatedAt',
        },
      ])
      .exec();
  }

  findOne(deliveryId: string) {
    return this.deliveryModel
      .findOne({
        _id: deliveryId,
      })
      .populate([
        { path: 'package', select: '' },
        {
          path: 'driver',
          select: '-hash -createdAt -updatedAt',
        },
      ])
      .exec();
  }

  async findAllForUser(userId: string) {
    return this.deliveryModel
      .find({
        driver: userId,
      })
      .exec();
  }

  async findOneForUser(userId: string, deliveryId: string) {
    return this.deliveryModel
      .findOne({
        driver: userId,
        _id: deliveryId,
      })
      .populate([
        { path: 'package', select: '' },
        {
          path: 'driver',
          select: '-hash -createdAt -updatedAt',
        },
      ])
      .exec();
  }

  async findAllForUserPackage(userId: string, pkgId: string) {
    return this.deliveryModel
      .find({
        $or: [{ driver: userId }, { package: pkgId }],
      })
      .exec();
  }

  // async findOneForUserPackage(
  //   userId: string,
  //   pkgId: string,
  //   deliveryId: string,
  // ) {
  //   return this.deliveryModel
  //     .findOne({
  //       _id: deliveryId,
  //       $or: [{}, {}],
  //     })
  //     .populate([])
  //     .exec();
  // }

  update(deliveryId: string, dto: UpdateDeliveryDto) {
    return this.deliveryModel.findByIdAndUpdate(deliveryId, { ...dto }).exec();
  }

  remove(id: string) {
    return this.deliveryModel.findByIdAndDelete(id).exec();
  }
}
