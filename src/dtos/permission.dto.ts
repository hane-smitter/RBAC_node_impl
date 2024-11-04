import { IsString, IsOptional, IsNotEmpty } from "class-validator";

export class CreatePermissionDto {
  @IsString()
  @IsNotEmpty({ message: "`name` cannot be empty!" })
  name!: string;

  @IsString()
  @IsNotEmpty({ message: "`description` cannot be empty!" })
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
