import { Inject, Injectable } from '@nestjs/common';
import { EditUserDto } from './dto';
import { User } from './entities';
import { UserModelProvider } from './user.provider';

@Injectable()
export class UserService {
  constructor(@Inject(UserModelProvider) private readonly userModel: User) {}

  async editUser(userId: string, dto: EditUserDto) {
    const user = await this.userModel
      .findByIdAndUpdate(userId, { ...dto })
      .exec();

    delete user.hash;
    return user;
  }
}
