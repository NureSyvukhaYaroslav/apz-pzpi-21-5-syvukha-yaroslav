import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';

import { UserControllerAdmin } from './user.controller.admin';
import { UserService } from './user.service';

@Module({
  imports: [CacheModule.register()],
  providers: [UserService],
  controllers: [UserControllerAdmin],
  exports: [UserService],
})
export class UserModule {}
