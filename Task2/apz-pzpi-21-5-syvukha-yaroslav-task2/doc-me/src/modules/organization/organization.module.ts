import { Module } from '@nestjs/common';

import { OrganizationController } from './organization.controller';
import { OrganizationService } from './organization.service';
import { DocumentModule } from '../document/document.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [DocumentModule, UserModule],
  providers: [OrganizationService],
  controllers: [OrganizationController],
})
export class OrganizationModule {}
