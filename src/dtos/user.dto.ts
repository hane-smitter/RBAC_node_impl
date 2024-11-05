import {
  IsEmail,
  IsString,
  MinLength,
  IsOptional,
  IsNumber,
  Min,
  IsArray,
} from "class-validator";
import type { Roles } from "../entities/Roles";

export class CreateUserDto {
  // @IsEmail()
  // email!: string;

  // @IsString()
  // @MinLength(8)
  // password!: string;

  @IsString()
  firstName!: string;

  @IsString()
  lastName!: string;

  @IsNumber()
  @Min(0)
  age!: number;
}

export class UserRolesDto {
  @IsArray()
  roles!: Roles["id"][];
}

export class UpdateUserDto {
  //   @IsEmail()
  //   @IsOptional()
  //   email?: string;

  //   @IsString()
  //   @MinLength(8)
  //   @IsOptional()
  //   password?: string;

  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  @IsNumber()
  @IsOptional()
  age?: number;
}
