import { Field, InputType } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';

@InputType()
export class UpdateMarketDto {
  @IsOptional()
  @Field(() => String, { nullable: true })
  name: string;

  @IsOptional()
  @Field(() => String, { nullable: true })
  description: string;

  @IsOptional()
  @Field(() => [String], { nullable: true })
  images: string[];

  @IsOptional()
  @Field(() => [String], { nullable: true })
  videos: string[];

  @IsOptional()
  @Field(() => String, { nullable: true })
  price: string;

  @IsOptional()
  @Field(() => Number, { nullable: true })
  category: number;

  @IsOptional()
  @Field(() => String, { nullable: true })
  location: string;
}
