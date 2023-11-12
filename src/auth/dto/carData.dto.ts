import { IsCreditCard, IsEmail, Length, IsInt, Min, Max, Matches, IsString, IsNumber,MinLength,MaxLength, IsNumberString, IsDateString, isNumberString } from 'class-validator';
export class CardDataDto{
    @IsEmail()
    @Length(5, 100)
    @Matches(/@(gmail\.com|hotmail\.com|yahoo\.es)$/, { message: 'Invalid email domain.' })
    email: string;
  
    @IsNumberString()
    @MinLength(13)
    @MaxLength(16)
    card_number: number;
  
    @IsNumberString()
    @MinLength(3)
    @MaxLength(4)
    cvv: number;
  
    @IsString()
    @Length(1,2)
    expiration_month: string;
  
    @IsString()
    @Length(4)
    expiration_year: string;

    token: string;
}