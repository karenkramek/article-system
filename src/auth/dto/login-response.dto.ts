import { Expose, Type } from 'class-transformer';

export class PermissionDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  description: string;
}

export class LoginUserDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  email: string;

  @Expose()
  @Type(() => PermissionDto)
  permissions: PermissionDto[];
}

export class LoginResponseDto {
  @Expose()
  access_token: string;

  @Expose()
  @Type(() => LoginUserDto)
  user: LoginUserDto;
}
