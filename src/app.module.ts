import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { AuthModule } from './auth/auth.module';
import * as redisStore from 'cache-manager-redis-store';



@Module({
  imports: [
    CacheModule.register({
      isGlobal: true,
      store: redisStore,
      host: 'localhost',
      port: 6379,
      ttl: 60
      
    }),
    AuthModule,
  ],
 
})

export class AppModule {}
