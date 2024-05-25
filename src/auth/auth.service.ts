import {
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as argon from 'argon2';

import { User } from 'src/mongoose';
import { UserModelProvider } from 'src/user/user.provider';
import { AuthDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject(UserModelProvider) private readonly userModel: typeof User,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async signup({ email, password }: AuthDto) {
    const hash = await argon.hash(password);

    const user = await this.userModel.findOne({ email }).exec();
    if (user) throw new ConflictException('credentials taken');

    const newUser = await this.userModel.create({ email, hash });

    return this.signToken(newUser.id, newUser.email);
  }

  async login({ email, password }: AuthDto) {
    const user = await this.userModel.findOne({ email }).exec();

    if (!user) {
      throw new UnauthorizedException();
    }

    const pwMatches = await argon.verify(user.hash, password);
    if (!pwMatches) {
      throw new ForbiddenException('credentials incorrect');
    }

    return this.signToken(user.id, user.email);
  }

  async signToken(
    userId: string,
    email: string,
  ): Promise<{ access_token: string }> {
    const payload = {
      sub: userId,
      email,
    };

    const access_token = await this.jwt.signAsync(payload, {
      expiresIn: '12h',
      secret: this.config.get('JWT_SECRET'),
    });

    return { access_token };
  }
}
