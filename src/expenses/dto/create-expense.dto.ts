import { IsString, IsNumber, IsUUID, IsArray } from 'class-validator';

export class CreateExpenseDto {
  @IsString()
  title: string;

  @IsNumber()
  amount: number;

  @IsUUID()
  payerId: string;

  @IsArray()
  @IsUUID('4', { each: true })
  sharedWithIds: string[];
}