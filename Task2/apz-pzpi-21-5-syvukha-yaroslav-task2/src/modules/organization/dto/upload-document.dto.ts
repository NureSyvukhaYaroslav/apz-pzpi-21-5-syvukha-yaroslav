import { IsString, IsNotEmpty, IsUUID } from 'class-validator';

export class UploadDocumentDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  documentType?: string;

  @IsUUID()
  @IsNotEmpty()
  organizationId?: string;
}
