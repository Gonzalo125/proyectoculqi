import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { TokenizadorModule } from './tokenizador/tokenizador.module';
import { AuthModule } from './auth/auth.module';
import * as redisStore from 'cache-manager-redis-store';



@Module({
  imports: [
    CacheModule.register({
      isGlobal: true,
      store: redisStore,
      host: 'localhost',
      port: 6379,
      
    }),
    TokenizadorModule,
    AuthModule,
  ],
 
})

export class AppModule {}
