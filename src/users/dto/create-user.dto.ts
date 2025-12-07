import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  IsArray,
  IsOptional,
  IsIn,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  @IsIn(['admin', 'editor', 'reader'], { each: true })
  permissions?: string[];
}
