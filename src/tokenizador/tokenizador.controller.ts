import { Controller, Get } from '@nestjs/common';
import { CacheKey, CacheTTL } from '@nestjs/cache-manager';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { TokenizadorService } from './tokenizador.service';
import { Param, UseInterceptors } from '@nestjs/common';
import { UpdateTokenizadorDto } from './dto/update-tokenizador.dto';
import { CreateTokenizadorDto } from './dto/create-tokenizador.dto';


@Controller('pokemon')
@UseInterceptors(CacheInterceptor)
export class TokenizadorController {
  constructor(private readonly service: TokenizadorService) {}
  @CacheKey('custom-key')
  @CacheTTL(10) // override TTL to 30 seconds
  @Get('/:id')
  async getPokemon(@Param('id') id: number): Promise<{nombre:string}> {
    return await this.service.getPokemon(+id);
  }
}
