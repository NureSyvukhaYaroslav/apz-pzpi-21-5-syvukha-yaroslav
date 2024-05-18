import { Role } from '@/types';

type User = {
  id: string;
  email: string;
  nickname: string;

  organizationId: string;

  roles: Role[];
  createdAt: Date;
  updatedAt: Date;
};

export default User;
