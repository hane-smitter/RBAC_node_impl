import { IsString, IsOptional, IsArray } from "class-validator";
import type { Permissions } from "../entities/Permissions";

export class CreateRoleDto {
  @IsString()
  name!: string;

  @IsString()
  description!: string;

  @IsArray()
  @IsOptional()
  permissions?: Permissions["id"][]; // `@IsOptional()` because it Will default to a `permission` from the controller
}

export class UpdateRoleDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsArray()
  @IsOptional()
  permissions?: Permissions["id"][];
}
