import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Package, PackageSchema } from './entities/package.entity';
import { PackageController } from './package.controller';
import { PackageService } from './package.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Package.name, schema: PackageSchema }]),
  ],
  controllers: [PackageController],
  providers: [PackageService],
})
export class PackageModule {}
