import { UnauthorizedException } from '@nestjs/common';
import { verify } from 'jsonwebtoken';
import { Socket } from 'socket.io';
import { UserModel } from 'src/user';

type SocketMiddleware = (socket: Socket, next: (err?: Error) => void) => void;

export const WsAuthMiddleware = (
  userModel: typeof UserModel,
): SocketMiddleware => {
  return async (socket, next) => {
    try {
      let token = socket.handshake?.auth?.token;
      const { authorization } = socket.handshake.headers;

      if (!token && authorization) {
        token = authorization.split(' ')[1];
      }

      if (!token) throw new UnauthorizedException();

      const payload = verify(token, process.env.JWT_SECRET);

      const user = await userModel.findOne({ _id: payload.sub }).exec();
      if (!user) throw new UnauthorizedException();
      delete user.hash;

      socket = Object.assign(socket, {
        user: user,
      });

      next();
    } catch (error) {
      next(error);
    }
  };
};
