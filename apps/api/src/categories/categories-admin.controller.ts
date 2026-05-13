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
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('admin/categories')
export class CategoriesAdminController {
  constructor(private readonly categories: CategoriesService) {}

  @Roles(UserRole.Admin, UserRole.Editor)
  @Post()
  create(@Body() dto: CreateCategoryDto) {
    return this.categories.create(dto);
  }

  @Roles(UserRole.Admin, UserRole.Editor)
  @Get()
  list() {
    return this.categories.findAllAdmin();
  }

  @Roles(UserRole.Admin, UserRole.Editor)
  @Patch(':id')
  update(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() dto: UpdateCategoryDto,
  ) {
    return this.categories.update(id, dto);
  }

  @Roles(UserRole.Admin, UserRole.Editor)
  @Delete(':id')
  remove(@Param('id', ParseObjectIdPipe) id: string) {
    return this.categories.remove(id);
  }
}
