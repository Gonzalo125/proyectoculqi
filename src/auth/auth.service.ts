import { Injectable, BadRequestException } from '@nestjs/common';
import { CardTokenDto } from './dto/cardToken.dto';
import { CardDataDto } from './dto/carData.dto';
import { CardResponse } from './dto/cardResponse.dto';
import { JwtService } from '@nestjs/jwt';
import { Cache } from 'cache-manager';
import { Inject } from '@nestjs/common/decorators';

@Injectable()
export class AuthService {
  constructor(
    
    private readonly jwtService: JwtService,
    @Inject('CACHE_MANAGER') private readonly cacheService: Cache,
  ) {}

  async register(cardToken: CardTokenDto): Promise<{ token: string }> {
   // const card = await this.findOne(cardToken.card_number);
   // if (card) {
     // throw new BadRequestException('Card already exists');
   // }

    try {
    //  await this.validar(cardToken);

      const payload = { cardToken };
      const token = await this.jwtService.signAsync(payload, { expiresIn: '1m' });
      await this.saveToken(cardToken, token);
      return { token };
    } catch (error) {
      throw new BadRequestException('Error saving card data');
    }
  }

  async saveToken(cardToken: CardTokenDto, token: string): Promise<void> {
    try {
      const obj = new CardDataDto();
      obj.card_number = cardToken.card_number;
      obj.email = cardToken.email;
      if (parseInt(cardToken.expiration_month, 10) >= 1 && parseInt(cardToken.expiration_month, 10) <= 12) {
        obj.expiration_month =cardToken.expiration_month;

      }else{
        throw new BadRequestException('El numero debe estar en el rango de 1 a 12');
      }
      const currentYear = new Date().getFullYear();
      if( parseInt(cardToken.expiration_year, 10) >= currentYear &&
      parseInt(cardToken.expiration_year, 10) <= currentYear + 5){
        obj.expiration_year= cardToken.expiration_year;

      }else{
        throw new BadRequestException('El rango de año debe ser el actual y 5 años mas');
      }
       
      obj.token = token;
      obj.cvv = cardToken.cvv;

      await this.cacheService.set(token, JSON.stringify(obj));
    } catch (error) {
      console.error('Error saving card token:', error.message);
      throw new BadRequestException('Error saving card token');
    }
  }

  async validar(cardToken: CardTokenDto): Promise<boolean> {
    try {
      const isValid = await this.guardarInformacionTarjeta(cardToken.card_number.toString());
      if (!isValid) {
        console.error('Número de tarjeta inválido. Error al guardado de información.');
      }
      return isValid;
    } catch (error) {
      console.error('Error validating card data:', error.message);
      return false;
    }
  }

  validarAlgoritmoLuhn(numeroTarjeta: string): boolean {
    const digitos = numeroTarjeta.replace(/\D/g, '');

    let suma = 0;
    let doble = false;

    for (let i = digitos.length - 1; i >= 0; i--) {
      let digito = parseInt(digitos.charAt(i), 10);

      if (doble) {
        digito *= 2;
        if (digito > 9) {
          digito -= 9;
        }
      }

      suma += digito;
      doble = !doble;
    }

    return suma % 10 === 0;
  }

  async guardarInformacionTarjeta(card_number: string): Promise<boolean> {
    return this.validarAlgoritmoLuhn(card_number);
  }

 /* async findOne(card_number: number): Promise<CardDataDto> {
    const cat = await this.cacheService.get(`card-${token}`);
    if (!cat) {
      throw new BadRequestException('Card not found');
    }
    return cat as CardDataDto;
  }
*/
  // ...

  async getCardDataFromToken(token: string): Promise<CardResponse> {
    try {
      
      
      
      const [, token1] = token.split(' ');
      const Key = `${token1}`;

      let  obj= new CardResponse();
   const cardData = await this.cacheService.get(Key);
      if (!cardData || Object.keys(cardData).length === 0) {
        throw new Error('Invalid token or card data not found');
      }else{
    
        const card= JSON.parse(String(cardData));
        obj= new CardResponse();
            obj.card_number=card.card_number;
            obj.email=card.email;
            obj.expiration_month=card.expiration_month;
            obj.expiration_year=card.expiration_year;
            obj.token=card.token;
        
      }

      return obj;
    } catch (error) {
      console.error('Error getting card data from token:', error.message);
      throw new BadRequestException('Invalid token or card data not found');
    }
  }
  
  

  async verifyAndGetData(token: string): Promise<CardResponse> {
    try {
     
      const data = await this.getCardDataFromToken(token);
      console.log(data);
      return data;
    } catch (error) {
      console.error('Error verifying and getting data:', error.message);
      throw new BadRequestException('Invalid token or card data not found');
    }
  }
  
}
