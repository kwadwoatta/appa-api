import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { Observable } from 'rxjs';
import { Socket } from 'socket.io';
import { UserModel } from 'src/user';

@Injectable()
export class WsJwtGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    if (context.getType() !== 'ws') return true;

    const client = context.switchToWs().getClient() as Socket;
    WsJwtGuard.validateToken(client);

    return true;
  }

  static async validateToken(socket: Socket) {
    let token = socket.handshake?.auth?.token;
    const { authorization } = socket.handshake.headers;

    if (authorization) {
      token = authorization.split(' ')[1];
    }

    if (!token) throw new UnauthorizedException();

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    await mongoose.connect(process.env.DB_URL);

    const user = await UserModel.findOne({ _id: payload.sub }).exec();
    if (!user) throw new UnauthorizedException();

    socket = Object.assign(socket, {
      user: user,
    });
  }
}
