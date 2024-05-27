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
import { AllowedRoles, Role } from 'common';
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
  @Post('delivery')
  create(@Body() createDeliveryDto: CreateDeliveryDto) {
    return this.deliveryService.create(createDeliveryDto);
  }

  @AllowedRoles(Role.Admin)
  @Get('delivery')
  findAll() {
    return this.deliveryService.findAll();
  }

  @AllowedRoles(Role.Admin)
  @Get('delivery:id')
  findOne(@Param('id') id: string) {
    return this.deliveryService.findOne(id);
  }

  @Get('users/me/delivery')
  findAllForUser(@GetUser() user: User) {
    return this.deliveryService.findAllForUser(user._id);
  }

  @Get('users/me/delivery/:id')
  findOneForUser(@GetUser() user: User, @Param('id') id: string) {
    return this.deliveryService.findOneForUser(user._id, id);
  }

  @AllowedRoles(Role.Admin)
  @Patch('delivery:id')
  update(
    @Param('id') id: string,
    @Body() updateDeliveryDto: UpdateDeliveryDto,
  ) {
    return this.deliveryService.update(id, updateDeliveryDto);
  }

  @AllowedRoles(Role.Admin)
  @Delete('delivery:id')
  remove(@Param('id') id: string) {
    return this.deliveryService.remove(id);
  }
}
