import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';

import { APP_GUARD } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { RoleGuard } from 'common';
import { DeliveryModule } from './delivery/delivery.module';
import { EventsModule } from './events/events.module';
import { PackageModule } from './package/package.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.DB_URL),
    AuthModule,
    UserModule,
    PackageModule,
    DeliveryModule,
    EventsModule,
  ],
  providers: [
    // {
    //   provide: APP_GUARD,
    //   useClass: JwtGuard,
    // },
    {
      provide: APP_GUARD,
      useClass: RoleGuard,
    },
  ],
})
export class AppModule {}
