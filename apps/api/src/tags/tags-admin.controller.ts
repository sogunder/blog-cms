import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ParseObjectIdPipe } from '@nestjs/mongoose';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../common/enums';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { TagsService } from './tags.service';

@Controller('admin/tags')
export class TagsAdminController {
  constructor(private readonly tags: TagsService) {}

  @Roles(UserRole.Admin, UserRole.Editor)
  @Post()
  create(@Body() dto: CreateTagDto) {
    return this.tags.create(dto);
  }

  @Roles(UserRole.Admin, UserRole.Editor)
  @Get()
  list() {
    return this.tags.findAllAdmin();
  }

  @Roles(UserRole.Admin, UserRole.Editor)
  @Patch(':id')
  update(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() dto: UpdateTagDto,
  ) {
    return this.tags.update(id, dto);
  }

  @Roles(UserRole.Admin, UserRole.Editor)
  @Delete(':id')
  remove(@Param('id', ParseObjectIdPipe) id: string) {
    return this.tags.remove(id);
  }
}
