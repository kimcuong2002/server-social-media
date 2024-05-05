import { Field, ObjectType } from '@nestjs/graphql';
import { UserDto } from '../../user/dto/user.dto';

@ObjectType('Market')
export class MarketDto {
  @Field(() => String)
  id: string;

  @Field(() => String)
  name: string;

  @Field(() => UserDto)
  author: string;

  @Field(() => [String])
  images: string[];

  @Field(() => [String])
  videos: string[];

  @Field(() => String)
  description: string;

  @Field(() => String)
  price: string;

  @Field(() => Number)
  category: number;

  @Field(() => String)
  location: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
