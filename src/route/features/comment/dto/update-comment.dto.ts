import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional } from 'class-validator';

@InputType()
export class UpdateCommentDto {
  @IsOptional()
  @Field(() => String, { nullable: true })
  content: string;

  @IsOptional()
  @Field(() => [String], { nullable: true })
  images: string[];

  @IsOptional()
  @Field(() => [String], { nullable: true })
  videos: string[];

  @IsOptional()
  @Field(() => String, { nullable: true })
  likes: string;

  @IsOptional()
  @Field(() => String, { nullable: true })
  replies: string;

  @IsOptional()
  @Field(() => Date, { defaultValue: new Date() })
  updatedAt: Date;
}
