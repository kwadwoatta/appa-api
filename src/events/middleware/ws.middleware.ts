import { Socket } from 'socket.io';
import { WsJwtGuard } from '../guards';

export type SocketIOMiddleware = {
  (client: Socket, next: (error?: Error) => void);
};

export function WsAuthMiddleware(): SocketIOMiddleware {
  return async (client, next) => {
    try {
      await WsJwtGuard.validateToken(client);
      next();
    } catch (error) {
      next(error);
    }
  };
}
