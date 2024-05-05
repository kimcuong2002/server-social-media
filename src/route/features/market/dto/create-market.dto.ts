import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

@InputType()
export class CreateMarketDto {
  @IsNotEmpty()
  @Field()
  name: string;

  @IsNotEmpty()
  @Field()
  description: string;

  @IsNotEmpty()
  @IsUUID()
  @Field()
  userId: string;

  @IsNotEmpty()
  @Field(() => [String], { defaultValue: [] })
  image: string[];

  @IsNotEmpty()
  @Field()
  price: number;

  @IsOptional()
  @Field({ nullable: true })
  location?: string;

  @IsOptional()
  @Field(() => Date, { defaultValue: new Date() })
  createdAt: Date;

  @IsOptional()
  @Field(() => Date, { defaultValue: new Date() })
  updatedAt: Date;
}
