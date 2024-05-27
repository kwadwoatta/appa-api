import { Prop } from '@nestjs/mongoose';
import { IsNumber, IsString } from 'class-validator';

export class Point {
  @IsString()
  @Prop({
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
      required: true,
    },
  })
  type: string;

  @IsNumber({}, { each: true })
  @Prop({
    coordinates: {
      type: [Number],
      required: true,
    },
  })
  coordinates: number[];
}
