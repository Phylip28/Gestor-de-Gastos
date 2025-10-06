import { IsString, IsArray, IsIn, ArrayMaxSize } from 'class-validator';

export class CreateTripDto {
  @IsString()
  name: string;

  @IsString()
  @IsIn(['COP', 'USD'])
  currency: string;

  @IsArray()
  @ArrayMaxSize(20)
  participantEmails: string[];
}