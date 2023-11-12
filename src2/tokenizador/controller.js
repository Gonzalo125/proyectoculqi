/*import { Body, Controller, Post, Headers } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RedisService } from 'nestjs-redis';
import { IsNumber, IsString, Length, IsEmail, Min, Max, IsIn } from 'class-validator';

class CardData {
  @IsNumber()
  @Length(13, 16)
  card_number: number;

  @IsNumber()
  @Length(3, 4)
  @IsIn([123, 4532], { message: 'CVV inválido' })
  cvv: number;

  @IsString()
  @Length(1, 2)
  @Min(1)
  @Max(12)
  expiration_month: string;

  @IsString()
  @Length(4, 4)
  expiration_year: string;

  @IsString()
  @Length(5, 100)
  @IsEmail({}, { message: 'Email inválido' })
  email: string;
}

@Controller('generatetoken')
export class TokenizationController {
  private readonly API_KEY = 'pk_test_LsRBKejzCOEEWOsw';

  constructor(
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
  ) {}

  @Post('/v2/tokens')
  async generateTokenV2(@Body() cardData: CardData): Promise<{ token: string }> {
    const token = this.jwtService.sign(cardData, { expiresIn: '1m' });
    await this.saveTokenInRedis(token, cardData);
    return { token };
  }

  @Post('/create-token')
  async createToken(@Body() cardData: CardData, @Headers('authorization') apiKey: string): Promise<{ token: string }> {
    this.validateApiKey(apiKey);

    // Utilizar el valor del encabezado como "token"
    const token = apiKey;

    // Guardar el token y otros datos en Redis
    await this.saveTokenInRedis(token, cardData);

    return { token };
  }

  @Post('/verify-token')
  async verifyToken(@Headers('authorization') apiKey: string): Promise<{ message: string }> {
    this.validateApiKey(apiKey);

    // Validar la presencia y validez del token en el header
    return { message: 'Token válido' };
  }

  private validateApiKey(apiKey: string): void {
    // Validar la presencia y validez de la clave en el header
    if (!apiKey || apiKey !== this.API_KEY) {
      throw new Error('Clave de API no válida');
    }
  }

  private async saveTokenInRedis(token: string, cardData: CardData): Promise<void> {
    const redisClient = this.redisService.getClient();
    const key = `token:${token}`;

    // Almacenar los datos de la petición junto con el token en Redis
    await redisClient.hmset(key, {
      card_number: cardData.card_number,
      cvv: cardData.cvv,
      expiration_month: cardData.expiration_month,
      expiration_year: cardData.expiration_year,
      email: cardData.email,
    });

    // Configurar la expiración del token en Redis
    await redisClient.expire(key, 60); // Expira en 60 segundos (1 minuto)
  }

  private async getCardDataFromToken(token: string): Promise<CardData> {
    // Obtener datos de la tarjeta almacenados en Redis utilizando el token
    const redisClient = this.redisService.getClient();
    const key = `token:${token}`;
    const cardData = await redisClient.hgetall(key);

    if (!cardData || Object.keys(cardData).length === 0) {
      throw new Error('Token inválido o datos de tarjeta no encontrados');
    }

    return cardData as CardData;
  }

  private async processCharge(cardData: CardData): Promise<any> {
    // Lógica de procesamiento del cargo (puedes implementar tu propia lógica aquí)
    // ...

    // Simulación: Devuelve un resultado de carga exitoso
    return { chargeStatus: 'success', amountCharged: 100.0 };
  }
}
}*/