import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Type } from 'class-transformer';
import {
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { Point } from 'common';
import mongoose, { Document } from 'mongoose';
import type { Delivery } from 'src/delivery';

import type { User } from 'src/user';
import { v4 as uuid } from 'uuid';

export type PackageDocument = Package & Document;

@Schema({ _id: false })
export class Package {
  @IsString()
  @IsOptional()
  @Prop({ type: String, default: uuid })
  _id: string;

  @IsOptional()
  @Prop({ type: Date, default: Date.now, required: true })
  createdAt: Date;

  @IsOptional()
  @Prop({ type: Date, default: Date.now, required: true })
  updatedAt: Date;

  @IsOptional()
  @IsUUID()
  @Prop({ type: String, ref: 'Delivery' })
  active_delivery_id?: string;

  @IsOptional()
  @IsUUID()
  @Prop({ type: String, ref: 'Delivery' })
  active_delivery?: Delivery;

  @IsString()
  @Prop({ type: String, required: true })
  description: string;

  @IsNumber()
  @Prop({ type: Number, required: true })
  weight: number;

  @IsNumber()
  @Prop({ type: Number, required: true })
  width: number;

  @IsNumber()
  @Prop({ type: Number, required: true })
  height: number;

  @IsNumber()
  @Prop({ type: Number, required: true })
  depth: number;

  @IsString()
  @Prop({ type: String, required: true })
  from_name: string;

  @IsString()
  @Prop({ type: String, required: true })
  from_address: string;

  @ValidateNested({ each: true })
  @Type(() => Point)
  @Prop(Point)
  from_location: Point;

  @IsString()
  @Prop({ type: String, required: true })
  to_name: string;

  @IsString()
  @Prop({ type: String, required: true })
  to_address: string;

  @ValidateNested({ each: true })
  @Type(() => Point)
  @Prop(Point)
  to_location: Point;

  @IsUUID('4', { each: true })
  @Prop([{ type: String, ref: 'Delivery', default: [] }])
  deliveries: Delivery[];

  @IsUUID()
  @Prop({ type: String, ref: 'User', required: true })
  from_user: User;

  @IsUUID()
  @Prop({ type: String, ref: 'User', required: true })
  to_user: User;
}

export const PackageSchema = SchemaFactory.createForClass(Package);

export const PackageModel = mongoose.model(Package.name, PackageSchema);
