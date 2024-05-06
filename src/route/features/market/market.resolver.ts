import {
  Args,
  Resolver,
  Query,
  Context,
  Mutation,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { MarketDto } from './dto/market.dto';
import { MarketService } from './market.service';
import { UserService } from '../user/user.service';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/route/auth/guard/jwt-auth.guard';
import { ParamsQueryDto } from 'src/ts/common';
import { PaginationMarketDto } from './dto/common.dto';
import { getUserIdFromJwt } from 'src/helper/getIdUserFromJwt';
import { CreateMarketDto } from './dto/create-market.dto';
import { Market } from './entities/market.entity';

@Resolver(() => MarketDto)
export class MarketResolver {
  constructor(
    private readonly marketService: MarketService,
    private readonly userService: UserService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Query(() => PaginationMarketDto)
  getProducts(
    @Args('filter') filter: ParamsQueryDto,
    @Args('page') page: number,
    @Args('limit') limit: number,
  ) {
    return this.marketService.getAllProduct(filter, page, limit);
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => PaginationMarketDto)
  getProductsByUser(
    @Args('filter') filter: ParamsQueryDto,
    @Args('page') page: number,
    @Args('limit') limit: number,
    @Context() context,
  ) {
    const userId = getUserIdFromJwt(context);
    return this.marketService.getAllProductByUser(userId, filter, page, limit);
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => MarketDto)
  getProductById(@Args('id') id: string) {
    return this.marketService.getProduct(id);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => MarketDto)
  createProduct(@Args('body') body: CreateMarketDto, @Context() context) {
    const userId = getUserIdFromJwt(context);
    return this.marketService.createProduct(userId, body);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => MarketDto)
  updateProduct(@Args('id') id: string, @Args('body') body: CreateMarketDto) {
    return this.marketService.updateProduct(id, body);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => MarketDto)
  deleteProduct(@Args('id') id: string) {
    return this.marketService.deleteProduct(id);
  }

  @ResolveField()
  author(@Parent() market: Market) {
    return this.userService.getUserById(market.author);
  }
}
