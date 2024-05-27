import { ArgumentsHost, Catch, HttpException } from '@nestjs/common';
import { BaseWsExceptionFilter, WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';

@Catch(WsException, HttpException)
export class WebsocketExceptionsFilter extends BaseWsExceptionFilter {
  catch(exception: WsException | HttpException, host: ArgumentsHost) {
    const socket = host.switchToWs().getClient() as Socket;
    const pattern = host.switchToWs().getPattern();

    const error =
      exception instanceof WsException
        ? exception.getError()
        : exception.getResponse();

    const details = error instanceof Object ? { ...error } : { message: error };

    socket.emit(
      pattern,
      JSON.stringify({
        ...details,
      }),
    );
  }
}
