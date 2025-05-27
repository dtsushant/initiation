import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { IUserData, IUserRO } from '../user.interface';
import { FormField } from '@xingine/core/xingine.decorator';

export class UserLoginDto {
  @FormField({
    name: 'user.email',
    label: 'Email Address',
    inputType: 'input',
    required: true,
    properties: { placeholder: 'Enter email' },
  })
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  readonly email!: string;

  @FormField({
    name: 'user.password',
    label: 'Password',
    inputType: 'password',
    required: true,
    properties: { placeholder: 'Enter password' },
  })
  @ApiProperty()
  @IsNotEmpty()
  readonly password!: string;

  @FormField({
    name: 'rememberMe',
    label: 'Remember Me',
    inputType: 'checkbox',
    properties: { label: 'Remember Me' },
  })
  @ApiProperty()
  readonly rememberMe?: boolean = false;
}

export class UserRO implements IUserRO {
  user!: IUserData;
}
