import { $Enums, Provider, User } from '@prisma/client';
import { Exclude } from 'class-transformer';

export class ProfileResponse implements User {
  id: string;
  email: string;
  nickname: string;

  @Exclude()
  password: string;
  @Exclude()
  provider: Provider;
  @Exclude()
  createdAt: Date;

  organizationId: string;

  roles: $Enums.Role[];
  updatedAt: Date;

  constructor(user: Partial<User>) {
    Object.assign(this, user);
  }
}
