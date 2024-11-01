import { IsString, IsOptional, IsDefined } from "class-validator";

export class CreateRoleDto {
  @IsString({ message: "role name is a string and is required" })
  name!: string;

  @IsString({ message: "role description is a string and is required" })
  description!: string;

  // @IsArray()
  // @IsOptional()
  // permissions?: Permissions["id"][]; // `@IsOptional()` because it Will default to a `permission` from the controller
}

export class UpdateRoleDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  // @IsArray()
  // @IsOptional()
  // permissions?: Permissions["id"][];
}
