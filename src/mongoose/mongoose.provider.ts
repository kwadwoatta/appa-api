import { Provider } from '@nestjs/common';
import mongoose from 'mongoose';

export const MongooseAsyncProvider = 'MongooseAsyncProvider';

export const mongooseProvider: Provider = {
  provide: MongooseAsyncProvider,
  useFactory: (): Promise<typeof mongoose> =>
    mongoose.connect(process.env.DB_URL),
};
