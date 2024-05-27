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
      type: [Number], // long, lat https://www.rfc-editor.org/rfc/rfc7946#section-3.1.1
      required: true,
    },
  })
  coordinates: number[];
}
