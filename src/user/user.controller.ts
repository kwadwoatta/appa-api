import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { AllowedRoles, Role, RoleGuard } from 'common';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { EditUserDto } from './dto';
import { User } from './entities/user.entity';
import { UserService } from './user.service';

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}
  @Get('me')
  getMe(@GetUser() user: User) {
    return user;
  }

  @AllowedRoles(Role.Admin)
  @UseGuards(RoleGuard)
  @Patch()
  editUser(@GetUser('id') userId: string, @Body() dto: EditUserDto) {
    return this.userService.editUser(userId, dto);
  }

  @AllowedRoles(Role.Admin)
  @UseGuards(RoleGuard)
  @Get()
  findAll() {
    return this.userService.findAll();
  }
}
