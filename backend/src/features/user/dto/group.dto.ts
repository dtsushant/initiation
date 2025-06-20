import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsUUID, IsArray } from 'class-validator';

export class CreateGroupDto {
  @ApiProperty()
  @IsString()
  name!: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  commandId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  secondInCommandId?: string;

  @ApiProperty({ required: false, type: [String] })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  memberIds?: string[];

  @ApiProperty({ required: false, type: [String] })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  roleIds?: string[];
}

export class UpdateGroupDto extends CreateGroupDto {}

export class GroupResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty({ required: false })
  description?: string;

  @ApiProperty({ required: false })
  command?: {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
  };

  @ApiProperty({ required: false })
  secondInCommand?: {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
  };

  @ApiProperty({ type: [Object] })
  members?: Array<{
    id: string;
    username: string;
    firstName: string;
    lastName: string;
  }>;

  @ApiProperty({ type: [Object] })
  roles?: Array<{
    id: string;
    name: string;
    description?: string;
  }>;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;
}