import { IsEmail, IsString, MinLength, MaxLength, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'johndoe', description: '用户名' })
  @IsString()
  @MinLength(4)
  @MaxLength(50)
  @Matches(/^[a-zA-Z0-9_]+$/, { message: '用户名只能包含字母、数字和下划线' })
  username: string;

  @ApiProperty({ example: 'john@example.com', description: '邮箱' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Password123!', description: '密码' })
  @IsString()
  @MinLength(8)
  @MaxLength(100)
  password: string;
}

export class LoginDto {
  @ApiProperty({ example: 'johndoe', description: '用户名或邮箱' })
  @IsString()
  username: string;

  @ApiProperty({ example: 'Password123!', description: '密码' })
  @IsString()
  password: string;
}

export class AuthResponseDto {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;

  @ApiProperty()
  user: {
    id: string;
    username: string;
    email: string;
    nickname: string;
    avatar: string;
    role: string;
  };
}
