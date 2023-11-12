import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants/jwt.constant';

@Module({
  imports: [
  JwtModule.register({

    secret: jwtConstants.secret,
    signOptions:{expiresIn:'60s'},
  })],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}
