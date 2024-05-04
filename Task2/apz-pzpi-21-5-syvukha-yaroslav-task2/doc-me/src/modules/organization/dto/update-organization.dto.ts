import { IsString, IsOptional, IsUUID } from 'class-validator';

export class UpdateOrganizationDto {
  @IsUUID()
  id: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  password?: string;
}
