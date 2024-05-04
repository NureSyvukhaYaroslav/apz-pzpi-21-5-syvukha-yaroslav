import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Role } from '@prisma/client';

import { Auth, File5Mb, Serialize } from '@/decorators';

import { DocumentResponse } from './document.response';
import { DocumentService } from './document.service';

@Auth(Role.ADMIN)
@Controller('document-admin')
export class DocumentControllerAdmin {
  constructor(private readonly profileService: DocumentService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @Serialize()
  async uploadDocument(
    @Body('userId') userId: string,
    @Body('documentType') documentType: string,
    @File5Mb() file: Express.Multer.File,
  ) {
    return new DocumentResponse(
      await this.profileService.uploadDocument({ userId, file, documentType }),
    );
  }

  @Get()
  @Serialize()
  async getDocuments() {
    return (await this.profileService.getDocuments({}, 'createdAt', true)).map(
      (file) => new DocumentResponse(file),
    );
  }

  @Delete(':id')
  @Serialize()
  async deleteDocument(
    @Body('userId') userId: string,
    @Param('id') id: string,
  ) {
    return this.profileService.deleteDocument(id, userId);
  }

  @Delete()
  @Serialize()
  async deleteAllDocuments() {
    return this.profileService.deleteAllDocuments();
  }

  @Get('/statistics')
  @Serialize()
  async getBasicStatistics(@Body('userId') userId: string) {
    return this.profileService.getBasicStatistics(userId);
  }
}
