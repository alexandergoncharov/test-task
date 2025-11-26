import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'User email or username',
  })
  @IsString()
  @IsNotEmpty({ message: 'Email or username is required' })
  emailOrUsername: string;

  @ApiProperty({
    example: 'password123',
    description: 'User password',
  })
  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  password: string;
}
