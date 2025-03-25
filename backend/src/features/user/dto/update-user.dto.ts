import { IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  readonly bio?: string;

  @IsOptional()
  @IsString()
  readonly email?: string;

  @IsOptional()
  @IsString()
  readonly image?: string;

  @IsOptional()
  @IsString()
  readonly username?: string;
}
