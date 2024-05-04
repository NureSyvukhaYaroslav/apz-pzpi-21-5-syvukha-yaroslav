import { Organization } from '.prisma/client';
import { Get, Injectable, UnauthorizedException } from '@nestjs/common';
import { Role } from '@prisma/client';
import { compareSync, genSaltSync, hashSync } from 'bcrypt';
import { v4 } from 'uuid';

import { Auth, CurrentUser } from '@/decorators';

import { CreateOrganizationDto } from './dto/create-organization.dto';
import { DeleteDocumentDto } from './dto/delete-document.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { UploadDocumentDto } from './dto/upload-document.dto';
import { DocumentService } from '../document/document.service';
import { OrganizationKeys } from '../document/types';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OrganizationService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly documentService: DocumentService,
  ) {}

  private hashPassword(password: string | undefined): string | undefined {
    if (!password) {
      return undefined;
    }

    return hashSync(password, genSaltSync());
  }

  async create(data: CreateOrganizationDto, userId: string) {
    const password = this.hashPassword(data.password);

    const org = await this.prismaService.organization.create({
      data: {
        id: v4(),
        name: data.name,
        accessPassword: password,
        createdAt: new Date(),
      },
    });

    await this.prismaService.user.update({
      where: { id: userId },
      data: { organizationId: org.id },
    });
  }

  async addUser(userId: string, organizationId: string, password: string) {
    const org = await this.prismaService.organization.findUnique({
      where: { id: organizationId },
    });

    if (!org) {
      throw new Error('Organization not found');
    }

    console.log('password ->', password);

    if (!compareSync(password, org.accessPassword)) {
      throw new UnauthorizedException('Wrong login or password');
    }

    return this.prismaService.user.update({
      where: { id: userId },
      data: { organizationId },
    });
  }

  async getById(id: string): Promise<Organization | null> {
    return this.prismaService.organization.findUnique({ where: { id } });
  }

  async getAll(): Promise<Organization[]> {
    return this.prismaService.organization.findMany();
  }

  async find(where: Partial<Organization>, sortBy: OrganizationKeys) {
    const orgs = await this.prismaService.organization.findMany({ where });

    if (orgs.length === 0) {
      return [];
    }

    orgs.forEach((org) => {
      delete org.accessPassword;
    });

    return orgs.sort((a, b) => {
      return a[sortBy] > b[sortBy] ? 1 : -1;
    });
  }

  async update(dto: UpdateOrganizationDto): Promise<Organization | null> {
    return this.prismaService.organization.update({
      where: { id: dto.id },
      data: { name: dto.name, updatedAt: new Date() },
    });
  }

  async delete(id: string): Promise<Organization | null> {
    return this.prismaService.organization.delete({ where: { id } });
  }

  async uploadDocument(dto: UploadDocumentDto, file: Express.Multer.File) {
    const org = await this.prismaService.organization.findUnique({
      where: { id: dto.organizationId },
    });

    if (!org) {
      throw new Error('Organization not found');
    }

    if (!compareSync(dto.password, org.accessPassword)) {
      throw new Error('Invalid password');
    }

    return this.documentService.uploadDocument({
      file: file,
      userId: dto.userId,
      organizationId: dto.organizationId,
      documentType: dto.documentType,
    });
  }

  async updateDocument(
    documentId: string,
    documentType: string,
    organizationId: string,
    password: string,
  ) {
    const org = await this.prismaService.organization.findUnique({
      where: { id: organizationId },
    });

    if (!org) {
      throw new Error('Organization not found');
    }

    if (org.accessPassword !== password) {
      throw new Error('Invalid password');
    }

    return this.documentService.updateDocument(documentId, documentType);
  }

  async deleteDocument(dto: DeleteDocumentDto) {
    const org = await this.prismaService.organization.findUnique({
      where: { id: dto.organizationId },
    });

    if (!org) {
      throw new Error('Organization not found');
    }

    if (org.accessPassword !== dto.password) {
      throw new Error('Invalid password');
    }

    return this.documentService.deleteDocument(dto.userId);
  }

  async deleteDocumentAdmin(id: string) {
    return this.documentService.deleteDocument(id);
  }
}
