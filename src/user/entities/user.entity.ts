import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Role } from 'common';
import mongoose, { Document } from 'mongoose';
import { Package } from 'src/package';
import { v4 as uuid } from 'uuid';

export type UserDocument = User & Document;

@Schema({ _id: false })
export class User {
  @Prop({ type: String, default: uuid })
  _id: string;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @Prop({ type: Date, default: Date.now })
  updatedAt: Date;

  @Prop({ type: String, unique: true })
  email: string;

  @Prop({ type: String })
  hash: string;

  @Prop({ type: String })
  address: string;

  @Prop({ type: String })
  firstName: string;

  @Prop({ type: String })
  lastName: string;

  @Prop({ type: String, enum: [Role.Admin, Role.Customer, Role.Driver] })
  role: Role;

  @Prop([{ type: String, ref: Package.name }])
  packages: Package[];
}

export const UserSchema = SchemaFactory.createForClass(User);
export const UserModel = mongoose.model(User.name, UserSchema);
