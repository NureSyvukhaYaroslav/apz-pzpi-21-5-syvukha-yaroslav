import { IsString, IsNotEmpty, IsUUID } from 'class-validator';

export class DeleteDocumentDto {
  @IsString()
  @IsNotEmpty()
  password: string;

  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @IsUUID()
  @IsNotEmpty()
  organizationId?: string;
}
