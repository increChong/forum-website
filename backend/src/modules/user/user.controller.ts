import { Controller, Get, Param, Put, Body, Request, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/user.dto';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('用户')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: '获取当前用户信息' })
  async getCurrentUser(@Request() req: any) {
    return req.user;
  }

  @Put('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: '更新当前用户信息' })
  async updateCurrentUser(@Request() req: any, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(req.user.id, updateUserDto);
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: '获取用户公开信息' })
  async getUserById(@Param('id') id: string) {
    const user = await this.userService.findById(id);
    if (!user) {
      return null;
    }
    // Return public profile only
    return {
      id: user.id,
      username: user.username,
      nickname: user.nickname,
      avatar: user.avatar,
      bio: user.bio,
      level: user.level,
      createdAt: user.createdAt,
    };
  }
}
