import { Provider } from '@nestjs/common';
import { Mongoose } from 'mongoose';
import { MongooseAsyncProvider, UserSchema } from 'src/mongoose';

export const UserModelProvider = 'UserModelProvider';

export const userProvider: Provider = {
  provide: UserModelProvider,
  inject: [MongooseAsyncProvider],
  useFactory: (mongoose: Mongoose) => mongoose.model('User', UserSchema),
};
