import { IsCreditCard, IsEmail, Length, IsInt, Min, Max, Matches, IsString } from 'class-validator';
export class CardTokenDto{
    @IsEmail()
    @Length(5, 100)
    @Matches(/@(gmail\.com|hotmail\.com|yahoo\.es)$/, { message: 'Invalid email domain.' })
    email: string;
  
    @IsInt()
    card_number: number;
  
    @IsInt()
    cvv: number;
  
    @IsString()
    expiration_month: string;
  
    @IsString()
    expiration_year: string;
    
    
    
}