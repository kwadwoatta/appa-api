import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AllowRole, Role } from 'common';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { User } from 'src/user';
import { CreatePackageDto } from './dto/create-package.dto';
import { UpdatePackageDto } from './dto/update-package.dto';
import { PackageService } from './package.service';

@UseGuards(JwtGuard)
@Controller()
export class PackageController {
  constructor(private readonly packageService: PackageService) {}

  @AllowRole(Role.Admin)
  @Post('package')
  create(@Body() createPackageDto: CreatePackageDto) {
    return this.packageService.create(createPackageDto);
  }

  @AllowRole(Role.Admin)
  @Get('package')
  findAll() {
    return this.packageService.findAll();
  }

  @AllowRole(Role.Admin)
  @Get('package:id')
  findOne(@Param('id') id: string) {
    return this.packageService.findOne(id);
  }

  @Get('users/me/package')
  findAllForUser(@GetUser() user: User) {
    return this.packageService.findAllForUser(user._id);
  }

  @Get('users/me/package/:id')
  findOneForUser(@GetUser() user: User, @Param('id') id: string) {
    return this.packageService.findOneForUser(user._id, id);
  }

  @AllowRole(Role.Admin)
  @Patch('package:id')
  update(@Param('id') id: string, @Body() updatePackageDto: UpdatePackageDto) {
    return this.packageService.update(id, updatePackageDto);
  }

  @AllowRole(Role.Admin)
  @Delete('package:id')
  remove(@Param('id') id: string) {
    return this.packageService.remove(id);
  }
}
