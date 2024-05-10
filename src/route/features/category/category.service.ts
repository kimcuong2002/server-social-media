import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { v4 as uuid } from 'uuid';
import { CreateCategoryDto } from './dto/create-category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async getCategories(): Promise<Category[]> {
    const categories = await this.categoryRepository.find();
    return categories;
  }

  async getTopicById(id: string): Promise<Category> {
    const category = await this.categoryRepository.findOneBy({ id });
    if (!category) {
      throw new NotFoundException("Category doesn't exist");
    }
    return category;
  }

  async getCategoryByName(name: string): Promise<Category> {
    const category = await this.categoryRepository.findOneBy({ name });
    if (!category) {
      throw new NotFoundException("Category doesn't exist");
    }
    return category;
  }

  async createCategory(body: CreateCategoryDto): Promise<Category> {
    try {
      const category = await this.categoryRepository.findOne({
        where: {
          name: body.name,
        },
      });

      if (category) {
        throw new Error('Category already exist');
      }

      return this.categoryRepository.save({
        id: uuid(),
        ...body,
      });
    } catch (error) {
      throw new Error('Create category error');
    }
  }
}
