import { Module } from '@nestjs/common';
import { TokenizadorService } from './tokenizador.service';
import { TokenizadorController } from './tokenizador.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [TokenizadorController],
  providers: [TokenizadorService],
})
export class TokenizadorModule {}
