import { IsString, IsOptional } from "class-validator";

export class CreatePermissionDto {
  @IsString({ message: "permission name is a string and is required" })
  name!: string;

  @IsString({ message: "permission description is a string and is required" })
  description!: string;
}

export class UpdatePermissionDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;
}
