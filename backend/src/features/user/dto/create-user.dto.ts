import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateUserDto {
  @ApiProperty()
  @IsNotEmpty()
  readonly username!: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  readonly email!: string;

  @ApiProperty()
  @IsNotEmpty()
  readonly password!: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  readonly roles?: string[];
}
