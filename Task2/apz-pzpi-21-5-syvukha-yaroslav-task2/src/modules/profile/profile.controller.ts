import { Controller, Delete, Get, Patch, Post } from '@nestjs/common';
import { User } from '@prisma/client';

import { CurrentUser, DecipherBody, Serialize } from '@/decorators';

import { ProfileService } from './profile.service';
import { UserResponse } from '../user/user.response';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  @Serialize()
  async getProfile(@CurrentUser('id') userId: string) {
    return new UserResponse(await this.profileService.getProfile(userId));
  }

  @Patch()
  @Serialize()
  async updateProfile(
    @CurrentUser('id') userId: string,
    @DecipherBody() newProfileData: Partial<User>,
  ) {
    return new UserResponse(
      await this.profileService.updateProfile(userId, newProfileData),
    );
  }

  @Delete()
  deleteProfile(@CurrentUser('id') userId: string) {
    return this.profileService.deleteProfile(userId);
  }

  @Get('statistics')
  async getBasicStatistics(@CurrentUser('id') userId: string) {
    return this.profileService.getBasicStatistics(userId);
  }

  @Post('/remove-organization')
  async removeOrganization(@CurrentUser('id') userId: string) {
    return this.profileService.updateProfile(userId, { organizationId: null });
  }
}
