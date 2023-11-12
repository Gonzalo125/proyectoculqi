import { IsCreditCard, IsEmail, Length, IsInt, Min, Max, Matches, IsString } from 'class-validator';
export class CardTokenDto{
    @IsEmail()
    @Length(5, 100)
    @Matches(/@(gmail\.com|hotmail\.com|yahoo\.es)$/, { message: 'Invalid email domain.' })
    email: string;
  
    @IsInt()
    @Length(13,16)
    card_number: number;
  
    @IsInt()
    @Length(3,4)
    cvv: number;
  
    @IsString()
    @Length(1,2)
    expiration_month: string;
  
    @IsString()
    @Length(4)
    @Min(new Date().getFullYear())
    @Max(new Date().getFullYear() + 5)
    expiration_year: string; 
}