import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { InjectRepository } from '@nestjs/typeorm';
import { Market } from './entities/market.entity';
import { Repository } from 'typeorm';
import { Pagination, ParamsQueryDto } from 'src/ts/common';
import { CreateMarketDto } from './dto/create-market.dto';
import { UpdateMarketDto } from './dto/update-market.dto';

@Injectable()
export class MarketService {
  constructor(
    @InjectRepository(Market) private marketRepository: Repository<Market>,
  ) {}

  async getAllProduct(
    filter: ParamsQueryDto,
    page = 1,
    limit = 10,
  ): Promise<Pagination<Market>> {
    const query = filter.query ? JSON.parse(filter.query) : {};
    const skip = (page - 1) * limit;

    const [result, count] = await this.marketRepository.findAndCount({
      where: query,
      skip,
      take: limit,
    });
    return new Pagination<Market>(result, count, page);
  }

  async getAllProductByUser(
    idUser: string,
    filter: ParamsQueryDto,
    page = 1,
    limit = 10,
  ): Promise<Pagination<Market>> {
    const query = filter.query ? JSON.parse(filter.query) : {};
    const skip = (page - 1) * limit;

    const [result, count] = await this.marketRepository.findAndCount({
      where: { author: idUser, ...query },
      skip,
      take: limit,
    });
    return new Pagination<Market>(result, count, page);
  }

  async getProduct(id: string): Promise<Market> {
    try {
      const product = await this.marketRepository.findOne({ where: { id } });
      if (!product) {
        throw new NotFoundException('Product not found');
      }
      return product;
    } catch (error) {
      throw new BadRequestException('Error get product');
    }
  }

  async createProduct(author: string, body: CreateMarketDto): Promise<Market> {
    try {
      return this.marketRepository.save({
        id: uuid(),
        author,
        ...body,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    } catch (error) {
      throw new BadRequestException('Error creating product');
    }
  }

  async updateProduct(id: string, body: UpdateMarketDto): Promise<Market> {
    try {
      const product = await this.marketRepository.findOne({ where: { id } });
      if (!product) {
        throw new NotFoundException('Product not found');
      }
      return this.marketRepository.save({
        ...product,
        ...body,
        updatedAt: new Date(),
      });
    } catch (error) {
      throw new BadRequestException('Error updating product');
    }
  }

  async deleteProduct(
    id: string,
  ): Promise<{ status: number; message: string }> {
    try {
      const product = await this.marketRepository.findOne({ where: { id } });
      if (!product) {
        throw new NotFoundException('Product not found');
      }
      await this.marketRepository.remove(product);
      return {
        status: HttpStatus.OK,
        message: 'Delete product successfully',
      };
    } catch (error) {
      throw new BadRequestException('Error deleting product');
    }
  }
}
