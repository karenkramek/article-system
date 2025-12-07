import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('permissions')
@UseGuards(JwtAuthGuard)
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Get()
  async findAll(@Query('name') name?: string) {
    if (name) {
      return this.permissionsService.findByName(name);
    }
    return this.permissionsService.findAll();
  }
}
