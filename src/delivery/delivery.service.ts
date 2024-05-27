import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateDeliveryDto } from './dto/create-delivery.dto';
import { UpdateDeliveryDto } from './dto/update-delivery.dto';
import { Delivery, DeliveryModel } from './entities/delivery.entity';

@Injectable()
export class DeliveryService {
  constructor(
    @InjectModel(Delivery.name)
    private readonly deliveryModel: typeof DeliveryModel,
  ) {}

  create(dto: CreateDeliveryDto) {
    return this.deliveryModel.create(dto);
  }

  findAll() {
    return this.deliveryModel.find().populate(['from_user', 'to_user']).exec();
  }

  findOne(deliveryId: string) {
    return this.deliveryModel
      .findOne({
        _id: deliveryId,
      })
      .populate(['from_user', 'to_user'])
      .exec();
  }

  async findAllForUser(userId: string) {
    return this.deliveryModel
      .find({
        $or: [{ from_user: userId }, { to_user: userId }],
      })
      .exec();
  }

  async findOneForUser(userId: string, deliveryId: string) {
    return this.deliveryModel
      .findOne({
        _id: deliveryId,
        $or: [{ from_user: userId }, { to_user: userId }],
      })
      .populate(['from_user', 'to_user'])
      .exec();
  }

  update(deliveryId: string, dto: UpdateDeliveryDto) {
    return this.deliveryModel.findByIdAndUpdate(deliveryId, { ...dto }).exec();
  }

  remove(id: string) {
    return this.deliveryModel.findByIdAndDelete(id).exec();
  }
}
