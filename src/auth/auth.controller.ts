import { Body, Controller, Post,Headers, UnauthorizedException,Request, UseInterceptors, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CardTokenDto } from './dto/cardToken.dto';
import { JwtService } from '@nestjs/jwt';
import { CardResponse } from './dto/cardResponse.dto';
import { CacheKey, CacheTTL } from '@nestjs/cache-manager';
import { CacheInterceptor } from '@nestjs/cache-manager';

@Controller('auth')
@UseInterceptors(CacheInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @CacheKey('custom-key')
  @CacheTTL(10) // override TTL to 30 seconds
  async register(@Body() cardToken: CardTokenDto): Promise<{ token: string }> {
    return this.authService.register(cardToken);
  }


  @Post('get-card-data')
  async getCardData(@Headers('authorization') token: string): Promise<CardResponse> {
    return this.authService.verifyAndGetData(token);
  }

 
}