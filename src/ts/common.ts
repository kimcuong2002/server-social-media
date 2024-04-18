import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';

export class Pagination<T> {
  constructor(public data: T[], public total: number, public page: number) {}
}

@InputType()
export class QueryPagination {
  @IsOptional()
  @Field(() => Number, { defaultValue: 1 })
  page: number;

  @IsOptional()
  @Field(() => Number, { defaultValue: 10 })
  limit: number;
}

@ObjectType()
export class ResponseDto {
  @Field()
  status: number;

  @Field()
  message: string;
}

@ObjectType()
export class ResponseQuantityDto {
  @Field()
  quantity: number;
}

@InputType()
export class ParamsQueryDto {
  @Field({ nullable: true })
  query?: string;
}
