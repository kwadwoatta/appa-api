import mongoose, { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';

export const UserSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: uuid,
    required: true,
  },
  createdAt: { type: Date, default: Date.now, required: true },
  updatedAt: { type: Date, default: Date.now, required: true },

  email: {
    type: String,
    unique: true,
    required: true,
    validate: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  hash: { type: String, required: true },
  address: { type: String },
  firstName: { type: String },
  lastName: { type: String },
  role: {
    type: String,
    enum: ['driver', 'tracker', 'admin'],
    required: true,
  },
  packages: [{ type: String, ref: 'Package' }],
});

export const User = mongoose.model('User', UserSchema);

const PointSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['Point'],
    required: true,
  },
  coordinates: {
    type: [Number],
    required: true,
  },
});

const PackageSchema = new Schema({
  _id: {
    type: String,
    default: uuid,
    required: true,
  },
  createdAt: { type: Date, default: Date.now, required: true },
  updatedAt: { type: Date, default: Date.now, required: true },

  active_delivery_id: { type: String, ref: 'Delivery' },
  description: { type: String },
  weight: { type: Number },
  width: { type: Number },
  height: { type: Number },
  depth: { type: Number },
  from_name: { type: String },
  from_address: { type: String },
  from_location: {
    type: {
      type: PointSchema,
      required: true,
    },
  },
  to_name: { type: String },
  to_address: { type: String },
  to_location: {
    type: {
      type: PointSchema,
      required: true,
    },
  },
  deliveries: [{ type: String, ref: 'Delivery' }],
  from_user: [{ type: String, ref: 'User' }],
  to_user: [{ type: String, ref: 'User' }],
});

export const Package = mongoose.model('Package', PackageSchema);

const DeliverySchema = new Schema({
  _id: {
    type: String,
    default: uuid,
    required: true,
  },
  createdAt: { type: Date, default: Date.now, required: true },
  updatedAt: { type: Date, default: Date.now, required: true },

  pickup_time: { type: Date },
  start_time: { type: Date },
  end_time: { type: Date },
  location: {
    type: {
      type: PointSchema,
      required: true,
    },
  },
  status: {
    type: String,
    enum: ['open', 'picked-up', 'in-transit', 'delivered', 'failed'],
    default: 'open',
  },
  package_id: { type: String, default: uuid, required: true },
  driver_id: { type: String, ref: 'User', required: true },
});

export const Delivery = mongoose.model('Delivery', DeliverySchema);
