import { ObjectType, Field } from '@nestjs/graphql';
import { MarketDto } from './market.dto';

@ObjectType()
export class PaginationMarketDto {
  @Field(() => [MarketDto])
  data: MarketDto[];

  @Field()
  total: number;

  @Field()
  page: number;
}
