import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType('Category')
export class CategoryDto {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  rank: number;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
