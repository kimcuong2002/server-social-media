import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional } from 'class-validator';

@InputType()
export class CreateCommentDto {
  @IsOptional()
  @Field(() => String, { nullable: true })
  content: string;

  @IsNotEmpty()
  @Field(() => String)
  postId: string;

  @IsNotEmpty()
  @Field(() => String)
  author: string;

  @IsOptional()
  @Field(() => [String], { defaultValue: [] })
  images: string[];

  @IsOptional()
  @Field(() => [String], { defaultValue: [] })
  videos: string[];

  @IsOptional()
  @Field(() => [String], { defaultValue: [] })
  likes: string[];

  @IsOptional()
  @Field(() => [String], { defaultValue: [] })
  replies: string[];

  @IsOptional()
  @Field(() => Date, { defaultValue: new Date() })
  createdAt: Date;

  @IsOptional()
  @Field(() => Date, { defaultValue: new Date() })
  updatedAt: Date;
}
