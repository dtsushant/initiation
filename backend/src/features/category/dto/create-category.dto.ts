import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty()
  @IsString()
  @Length(6, 6, { message: 'Code must be exactly 6 characters long' })
  code!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'Label is required' })
  label!: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @Length(6, 6, {
    message: 'Parent category code must be exactly 6 characters long',
  })
  parentCategoryCode?: string;

  newField!: number;
}
