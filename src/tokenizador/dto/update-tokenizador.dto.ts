import { PartialType } from '@nestjs/mapped-types';
import { CreateTokenizadorDto } from './create-tokenizador.dto';

export class UpdateTokenizadorDto extends PartialType(CreateTokenizadorDto) {}
