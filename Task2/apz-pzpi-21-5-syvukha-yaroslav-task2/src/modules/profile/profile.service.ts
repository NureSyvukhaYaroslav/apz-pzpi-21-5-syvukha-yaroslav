import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';

import { DocumentService } from '../document/document.service';
import { UserService } from '../user/user.service';

@Injectable()
export class ProfileService {
  constructor(
    private readonly userService: UserService,
    private readonly documentService: DocumentService,
  ) {}

  getProfile(profileId: string) {
    return this.userService.findOne({ id: profileId });
  }

  updateProfile(profileId: string, profileUpdateData: Partial<User>) {
    return this.userService.update(profileId, profileUpdateData);
  }

  deleteProfile(profileId: string) {
    return this.userService.delete(profileId);
  }

  async getBasicStatistics(profileId: string) {
    const files = await this.documentService.getDocuments(
      { userId: profileId },
      'createdAt',
      true,
    );

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
