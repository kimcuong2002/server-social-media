import { Field, InputType } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';

@InputType()
export class UpdateTopicDto {
  @IsOptional()
  @Field(() => String, { nullable: true })
  image: string;

  @IsOptional()
  @Field(() => String, { nullable: true })
  name: string;

  @IsOptional()
  @Field(() => String, { nullable: true })
  color: string;

  @IsOptional()
  @Field(() => Number, { nullable: true })
  rank: number;

  @IsOptional()
  @Field(() => Date, { defaultValue: new Date() })
  updatedAt: Date;
}
