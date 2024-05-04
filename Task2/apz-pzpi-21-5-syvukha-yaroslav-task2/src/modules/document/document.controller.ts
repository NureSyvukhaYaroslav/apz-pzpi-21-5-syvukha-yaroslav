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

import { CurrentUser, File5Mb, Public, Serialize } from '@/decorators';

import { DocumentResponse } from './document.response';
import { DocumentService } from './document.service';
import { FileKeys } from './types';

@Controller('document')
export class DocumentController {
  constructor(private readonly profileService: DocumentService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @Serialize()
  async uploadDocument(
    @CurrentUser('id') userId: string,
    @Body('documentType') documentType: string,
    @File5Mb() file: Express.Multer.File,
  ) {
    return new DocumentResponse(
      await this.profileService.uploadDocument({ userId, file, documentType }),
    );
  }

  @Public()
  @Post('organization/upload')
  @UseInterceptors(FileInterceptor('file'))
  @Serialize()
  async uploadOrganizationDocument(
    @Body('userId') userId: string,
    @Body('documentType') documentType: string,
    @Body('organizationId') organizationId: string,
    @File5Mb() file: Express.Multer.File,
  ) {
    return new DocumentResponse(
      await this.profileService.uploadDocument({
        userId,
        file,
        documentType,
        organizationId,
      }),
    );
  }

  @Get()
  @Serialize()
  async getDocuments(@CurrentUser('id') userId: string) {
    return (
      await this.profileService.getDocuments({ userId }, 'createdAt', true)
    ).map((file) => new DocumentResponse(file));
  }

  @Public()
  @Post('search/:sortBy')
  async searchDocuments(
    @Body() data: Partial<File>,
    @Param('sortBy') sortBy: FileKeys,
  ) {
    return (await this.profileService.getDocuments(data, sortBy, true)).map(
      (file) => new DocumentResponse(file),
    );
  }

  @Get(':documentId')
  @Serialize()
  async getDocument(
    @CurrentUser('id') userId: string,
    @Param('documentId') documentId: string,
  ) {
    return this.profileService.getFile(documentId, userId);
  }

  @Delete(':documentId')
  @Serialize()
  async deleteDocument(
    @CurrentUser('id') userId: string,
    @Param('documentId') documentId: string,
  ) {
    return this.profileService.deleteDocument(documentId, userId);
  }

  @Get('/statistics')
  @Serialize()
  async getBasicStatistics(@CurrentUser('id') userId: string) {
    return this.profileService.getBasicStatistics(userId);
  }
}
