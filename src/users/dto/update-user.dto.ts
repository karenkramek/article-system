import {
  IsEmail,
  IsOptional,
  IsString,
  MinLength,
  IsArray,
  IsIn,
} from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  @MinLength(6)
  password?: string;

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  @IsIn(['admin', 'editor', 'reader'], { each: true })
  permissions?: string[];
}
