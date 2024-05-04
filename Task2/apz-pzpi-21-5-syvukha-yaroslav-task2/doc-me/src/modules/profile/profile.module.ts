import { Module } from '@nestjs/common';

import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { DocumentModule } from '../document/document.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [UserModule, DocumentModule],
  providers: [ProfileService],
  controllers: [ProfileController],
  exports: [ProfileService],
})
export class ProfileModule {}
