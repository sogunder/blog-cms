import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserRole } from '../common/enums';
import type { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { StatsService } from './stats.service';

@ApiTags('stats')
@ApiBearerAuth()
@Controller('admin/stats')
export class StatsController {
  constructor(private readonly stats: StatsService) {}

  @Roles(UserRole.Admin, UserRole.Editor)
  @Get('dashboard')
  @ApiOperation({ summary: 'Get dashboard statistics' })
  @ApiResponse({ status: 200, description: 'Return counts for posts, categories, etc.' })
  dashboard(@CurrentUser() user: JwtPayload) {
    return this.stats.dashboard(user.sub, user.role);
  }
}
