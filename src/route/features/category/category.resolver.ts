import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { CategoryDto } from './dto/category.dto';
import { CategoryService } from './category.service';
import { UseGuards } from '@nestjs/common';
import { RolesGuard } from 'src/route/auth/guard/roles.guard';
import { Roles } from 'src/route/auth/decorators/roles.decorator';
import { EnumRole } from 'src/ts/enum';
import { JwtAuthGuard } from 'src/route/auth/guard/jwt-auth.guard';
import { CreateCategoryDto } from './dto/create-category.dto';

@Resolver(() => CategoryDto)
export class CategoryResolver {
  constructor(private categoryService: CategoryService) {}

  @Query(() => [CategoryDto], { name: 'categories' })
  async getCategories() {
    return await this.categoryService.getCategories();
  }

  @Query(() => CategoryDto, { name: 'category' })
  async getCategory(@Args('id') id: string) {
    return await this.categoryService.getTopicById(id);
  }

  @Query(() => CategoryDto, { name: 'category' })
  async getCategoryByName(@Args('name') name: string) {
    return await this.categoryService.getCategoryByName(name);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(EnumRole.ADMIN)
  @Mutation(() => CategoryDto)
  async createCategory(@Args('body') body: CreateCategoryDto) {
    return await this.categoryService.createCategory(body);
  }
}
