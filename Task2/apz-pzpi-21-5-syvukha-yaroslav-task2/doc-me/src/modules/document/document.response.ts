import { File, User } from '@prisma/client';
import { Exclude } from 'class-transformer';

export class DocumentResponse implements File {
  id: string;
  name: string;
  type: string;

  @Exclude()
  data: Buffer;
  createdAt: Date;
  userId: string;
  organizationId: string;
  documentType: string;

  constructor(user: Partial<User>) {
    Object.assign(this, user);
  }
}
