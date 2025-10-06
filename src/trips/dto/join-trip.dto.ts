import { IsString } from 'class-validator';

export class JoinTripDto {
  @IsString()
  code: string;
}