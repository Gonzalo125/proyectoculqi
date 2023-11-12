import { Module } from '@nestjs/common';
import { TokenizationController } from './tokenization.controller';
import { TokenizationService } from './tokenization.service';

@Module({
  controllers: [TokenizationController],
  providers: [TokenizationService],
})
export class TokenizationModule {}