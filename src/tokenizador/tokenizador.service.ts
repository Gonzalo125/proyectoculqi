import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject } from '@nestjs/common/decorators'; // <-- Quitar la segunda importación
import { Cache } from 'cache-manager';

@Injectable()
export class TokenizadorService {
  constructor(
    private readonly httpService: HttpService,
    @Inject(CACHE_MANAGER) private cacheService: Cache,
  ) {}

  async getPokemon(id: number): Promise<{ nombre: string }> {
    // check if data is in cache:
    const cachedData = await this.cacheService.get<{ nombre: string }>(
      id.toString(),
    );

    if (cachedData) {
      console.log(`Getting data from cache!`);
      return { nombre: cachedData.nombre };
    }

    // if not, call API and set the cache:
    const { data } = await this.httpService.axiosRef.get(
      `https://pokeapi.co/api/v2/pokemon/${id}`,
    );

    await this.cacheService.set(id.toString(), data);
    
    return { nombre: data.name };
  }

  getHello(){
    return null;
  }
}