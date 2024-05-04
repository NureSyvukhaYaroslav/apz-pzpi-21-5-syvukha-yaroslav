import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { Role, User } from '@prisma/client';

import { Serialize, Auth, DecipherBody } from '@/decorators';

import { UserResponse } from './user.response';
import { UserService } from './user.service';

@Auth(Role.ADMIN)
@Controller('user')
export class UserControllerAdmin {
  constructor(private readonly userService: UserService) {}

  @Get()
  @Serialize()
  async getUsers() {
    const users = await this.userService.findMany({});
    return users.map((user) => new UserResponse(user));
  }

  @Serialize()
  @Get(':id')
  async findOneUser(@Param('id') id: string) {
    const user = await this.userService.findOne({ id });
    return new UserResponse(user);
  }

  @Post(':id')
  @Serialize()
  async updateUser(
    @Param('id') id: string,
    @DecipherBody('user') user: Partial<User>,
  ) {
    const updatedUser = await this.userService.update(id, user);
    return new UserResponse(updatedUser);
  }

  @Delete(':id')
  async deleteUser(@Param('id', ParseUUIDPipe) id: string) {
    return this.userService.delete(id);
  }
}
