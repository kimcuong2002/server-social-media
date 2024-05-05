import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional } from 'class-validator';

@InputType()
export class CreateMarketDto {
  @IsNotEmpty()
  @Field()
  name: string;

  @IsNotEmpty()
  @Field()
  description: string;

  @IsOptional()
  @Field(() => [String], { defaultValue: [] })
  images: string[];

  @IsOptional()
  @Field(() => [String], { defaultValue: [] })
  videos: string[];

  @IsNotEmpty()
  @Field()
  price: string;

  @IsNotEmpty()
  @Field()
  category: number;

  @IsNotEmpty()
  @Field(() => String)
  location: string;

  @IsOptional()
  @Field(() => Date, { defaultValue: new Date() })
  createdAt: Date;

  @IsOptional()
  @Field(() => Date, { defaultValue: new Date() })
  updatedAt: Date;
}
