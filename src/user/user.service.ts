import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { EditUserDto } from './dto';
import { User, UserModel } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: typeof UserModel,
  ) {}

  async editUser(userId: string, dto: EditUserDto) {
    const user = await this.userModel
      .findByIdAndUpdate(userId, { ...dto })
      .exec();

    delete user.hash;
    return user;
  }

  findAll() {
    return this.userModel
      .find()
      .populate([{ path: 'packages' }])
      .exec();
  }
}
