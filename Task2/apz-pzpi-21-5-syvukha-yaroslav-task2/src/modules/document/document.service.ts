import { Injectable, StreamableFile } from '@nestjs/common';
import { File } from '@prisma/client';
import { v4 } from 'uuid';

import { FileKeys } from './types';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DocumentService {
  constructor(private readonly prismaService: PrismaService) {}

  async uploadDocument({
    userId,
    documentType,
    organizationId,
    file,
  }: {
    userId: string;
    documentType?: string;
    organizationId?: string;
    file: Express.Multer.File;
  }) {
    const dbFile = await this.prismaService.file.create({
      data: {
        id: v4(),
        userId,
        data: file.buffer,
        type: file.mimetype,
        documentType,
        organizationId,
        createdAt: new Date(),
      },
    });

    return dbFile;
  }

  async updateDocument(documentId: string, documentType: string) {
    return this.prismaService.file.update({
      where: { id: documentId },
      data: { documentType },
    });
  }

  async getDocument(where: Partial<File>, omitBytes: boolean = false) {
    const file = await this.prismaService.file.findFirstOrThrow({
      where,
    });

    if (omitBytes) {
      delete file.data;
    }

    return file;
  }

  async getDocuments(
    where: Partial<File>,
    sortBy: FileKeys,
    omitBytes: boolean = false,
  ) {
    const files = await this.prismaService.file.findMany({
      where,
    });

    if (files.length === 0) {
      return [];
    }

    if (omitBytes) {
      files.forEach((f) => delete f.data);
    }

    if (!(sortBy in files[0])) {
      throw Error('Invalid sortBy key');
    }

    const sortedFiles = files.sort((a, b) => {
      if (a[sortBy] < b[sortBy]) {
        return -1;
      }
      if (a[sortBy] > b[sortBy]) {
        return 1;
      }
      return 0;
    });

    return sortedFiles;
  }

  async getFile(id: string, userId?: string, organizationId?: string) {
    if (!userId && !organizationId) {
      throw new Error('Either userId or organizationId must be provided');
    }

    let file: File | null = null;

    console.log(id, userId, organizationId);

    if (userId) {
      file = await this.prismaService.file.findFirst({
        where: { id, userId },
      });
    }

    if (organizationId) {
      file = await this.prismaService.file.findFirst({
        where: { id, organizationId },
      });
    }

    console.log(file);

    return new StreamableFile(file.data, { type: file.type });
  }

  async deleteDocument(id: string, userId?: string, organizationId?: string) {
    if (!userId && !organizationId) {
      throw new Error('Either userId or organizationId must be provided');
    }

    if (userId) {
      return this.prismaService.file.delete({
        where: { id, userId },
      });
    }

    return this.prismaService.file.delete({
      where: { id, organizationId },
    });
  }

  async deleteAllDocuments() {
    return this.prismaService.file.deleteMany();
  }

  async getBasicStatistics(id: string) {
    const files = await this.prismaService.file.findMany({
      where: { organizationId: id },
    });

    if (!files.length) {
      return {
        filesCount: 0,
        categories: {},
        amountOfCategories: 0,
        oldestFile: null,
        newestFile: null,
        filesByDate: {},
      };
    }

    const categories: unknown = files.reduce((acc, file) => {
      if (!acc[file.documentType]) {
        acc[file.documentType] = 1;
      } else {
        acc[file.documentType]++;
      }

      return acc;
    }, {});

    const filesByDate: Record<string, number> = files.reduce((acc, file) => {
      const date = file.createdAt.toISOString().split('T')[0];
      if (!acc[date]) {
        acc[date] = 1;
      } else {
        acc[date]++;
      }
      return acc;
    }, {});

    return {
      filesCount: files.length,
      categories,
      amountOfCategories: Object.keys(categories).length,
      oldestFile: files[files.length - 1].createdAt,
      newestFile: files[0].createdAt,
      filesByDate,
    };
  }
}
