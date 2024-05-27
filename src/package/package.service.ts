import { Injectable } from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { CreatePackageDto } from './dto/create-package.dto';
import { UpdatePackageDto } from './dto/update-package.dto';
import { Package, PackageModel } from './entities/package.entity';

@Injectable()
export class PackageService {
  constructor(
    @InjectModel(Package.name)
    private readonly packageModel: typeof PackageModel,
  ) {}

  create(dto: CreatePackageDto) {
    return this.packageModel.create(dto);
  }

  findAll() {
    return this.packageModel.find().populate(['from_user', 'to_user']).exec();
  }

  findOne(packageId: string) {
    return this.packageModel
      .findOne({
        _id: packageId,
      })
      .populate(['from_user', 'to_user'])
      .exec();
  }

  async findAllForUser(userId: string) {
    return this.packageModel
      .find({
        $or: [{ from_user: userId }, { to_user: userId }],
      })
      .exec();
  }

  async findOneForUser(userId: string, packageId: string) {
    return this.packageModel
      .findOne({
        _id: packageId,
        $or: [{ from_user: userId }, { to_user: userId }],
      })
      .populate(['from_user', 'to_user'])
      .exec();
  }

  update(packageId: string, dto: UpdatePackageDto) {
    return this.packageModel.findByIdAndUpdate(packageId, { ...dto }).exec();
  }

  remove(id: string) {
    return this.packageModel.findByIdAndDelete(id).exec();
  }
}
