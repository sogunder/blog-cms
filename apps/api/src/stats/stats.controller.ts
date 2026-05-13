import { Controller, Get } from '@nestjs/common';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../common/enums';
import { StatsService } from './stats.service';

@Controller('admin/stats')
export class StatsController {
  constructor(private readonly stats: StatsService) {}

  @Roles(UserRole.Admin, UserRole.Editor)
  @Get('dashboard')
  dashboard() {
    return this.stats.dashboard();
  }
}
