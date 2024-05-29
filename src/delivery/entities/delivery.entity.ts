import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsUUID } from 'class-validator';
import { DeliveryStatus, Point } from 'common';
import type { Document } from 'mongoose';
import mongoose from 'mongoose';
import type { Package } from 'src/package';
import type { User } from 'src/user';
import { v4 as uuid } from 'uuid';

export type DeliveryDocument = Delivery & Document;

@Schema({ _id: false })
export class Delivery {
  @Prop({ default: uuid, required: true, type: String })
  _id: string;

  @Prop({ type: String })
  name: string;

  @Prop({ default: Date.now, required: true, type: Date })
  createdAt: Date;

  @Prop({ default: Date.now, required: true, type: Date })
  updatedAt: Date;

  @Prop({ type: Date })
  pickup_time?: Date;

  @Prop({ type: Date })
  start_time?: Date;

  @Prop({ type: Date })
  end_time?: Date;

  @Prop({ type: Point })
  location?: Point;

  @Prop({
    default: DeliveryStatus.Open,
    enum: [
      DeliveryStatus.Open,
      DeliveryStatus.PickedUp,
      DeliveryStatus.InTransit,
      DeliveryStatus.Delivered,
      DeliveryStatus.Failed,
    ],
    type: String,
  })
  status: DeliveryStatus;

  @IsUUID()
  @Prop({ type: String, ref: 'Package', required: true })
  package: Package;

  @IsUUID()
  @Prop({ type: String, ref: 'User', required: true })
  customer: User;

  @IsUUID()
  @Prop({ type: String, ref: 'User', required: true })
  driver: User;
}

export const DeliverySchema = SchemaFactory.createForClass(Delivery);

export const DeliveryModel = mongoose.model(Delivery.name, DeliverySchema);
