import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { CurrentUser, DecipherBody, File5Mb } from '@/decorators';

import { CreateOrganizationDto } from './dto/create-organization.dto';
import { DeleteDocumentDto } from './dto/delete-document.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { UploadDocumentDto } from './dto/upload-document.dto';
import { OrganizationService } from './organization.service';
import { UserService } from '../user/user.service';

@Controller('organization-admin')
export class OrganizationControllerAdmin {
  constructor(
    private readonly organizationService: OrganizationService,
    private readonly userService: UserService,
  ) {}

  @Get()
  async getAll() {
    return this.organizationService.getAll();
  }

  @Get('/id/:id')
  async findOne(@Param('id') id: string) {
    return this.organizationService.getById(id);
  }

  @Get('/user-organization')
  async getUserOrganization(@CurrentUser('id') id: string) {
    const user = await this.userService.findOne({ id });

    if (!user) {
      throw new Error('User not found');
    }

    return this.organizationService.getById(user.organizationId);
  }

  @Post()
  async create(
    @CurrentUser('id') id: string,
    @DecipherBody() dto: CreateOrganizationDto,
  ) {
    return this.organizationService.create(dto, id);
  }

  @Post('/update')
  async update(@Body() dto) {
    return this.organizationService.update(dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.organizationService.delete(id);
  }

  @UseInterceptors(FileInterceptor('file'))
  @Post('upload-document')
  async uploadDocument(
    @Body() dto: UploadDocumentDto,
    @File5Mb() file: Express.Multer.File,
  ) {
    return this.organizationService.uploadDocument(dto, file);
  }

  @Delete()
  async deleteDocument(@Body('id') id: string) {
    return this.organizationService.deleteDocumentAdmin(id);
  }
}
