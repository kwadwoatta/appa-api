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
import { AllowedRoles, Role, RoleGuard } from 'common';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { User } from 'src/user';
import { DeliveryService } from './delivery.service';
import { CreateDeliveryDto } from './dto/create-delivery.dto';
import { UpdateDeliveryDto } from './dto/update-delivery.dto';

@UseGuards(JwtGuard)
@Controller()
export class DeliveryController {
  constructor(private readonly deliveryService: DeliveryService) {}

  @AllowedRoles(Role.Admin)
  @UseGuards(RoleGuard)
  @Post('delivery')
  create(@Body() createDeliveryDto: CreateDeliveryDto) {
    return this.deliveryService.create(createDeliveryDto);
  }

  @AllowedRoles(Role.Admin)
  @UseGuards(RoleGuard)
  @Get('delivery')
  findAll() {
    return this.deliveryService.findAll();
  }

  @AllowedRoles(Role.Admin)
  @UseGuards(RoleGuard)
  @Get('delivery/:deliveryId')
  findOne(@Param('deliveryId') deliveryId: string) {
    return this.deliveryService.findOne(deliveryId);
  }

  @Get('users/me/delivery')
  findAllForUser(@GetUser() user: User) {
    return this.deliveryService.findAllForUser(user._id);
  }

  @Get('users/me/delivery/:deliveryId')
  findOneForUser(
    @GetUser() user: User,
    @Param('deliveryId') deliveryId: string,
  ) {
    return this.deliveryService.findOneForUser(user._id, deliveryId);
  }

  @Get('users/me/package/:pkgId/delivery')
  findAllForUserPackage(@GetUser() user: User, @Param('pkgId') pkgId: string) {
    return this.deliveryService.findAllForUserPackage(user._id, pkgId);
  }

  // @Get('users/me/package/:pkgId/delivery/:deliveryId')
  // findOneForUserPackage(
  //   @GetUser() user: User,
  //   @Param('deliveryId') deliveryId: string,
  //   @Param('pkgId') pkgId: string,
  // ) {
  //   return this.deliveryService.findOneForUserPackage(
  //     user._id,
  //     pkgId,
  //     deliveryId,
  //   );
  // }

  @AllowedRoles(Role.Admin)
  @UseGuards(RoleGuard)
  @Patch('delivery/:deliveryId')
  update(
    @Param('deliveryId') deliveryId: string,
    @Body() updateDeliveryDto: UpdateDeliveryDto,
  ) {
    return this.deliveryService.update(deliveryId, updateDeliveryDto);
  }

  @AllowedRoles(Role.Admin)
  @UseGuards(RoleGuard)
  @Delete('delivery/:deliveryId')
  remove(@Param('deliveryId') deliveryId: string) {
    return this.deliveryService.remove(deliveryId);
  }
}
