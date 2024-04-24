import { Field, ID, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

@InputType()
export class CreatePostDto {
  @IsNotEmpty()
  @IsUUID('4', { each: true })
  @Field(() => ID)
  topic: string;

  @IsNotEmpty()
  @Field()
  content: string;

  @IsOptional()
  @Field(() => [String], { defaultValue: [] })
  images: string[];

  @IsOptional()
  @Field(() => [String], { defaultValue: [] })
  video: string[];

  @IsOptional()
  @Field(() => Boolean, { defaultValue: false })
  isGhim: boolean;

  @IsOptional()
  @Field(() => Number, { defaultValue: 0 })
  quantityComments: number;

  @IsOptional()
  @Field(() => [String], { defaultValue: [] })
  usersLiked: string[];

  @IsOptional()
  @Field(() => [String], { defaultValue: [] })
  authorsPostShared: string[];

  @IsOptional()
  @Field(() => Boolean, { defaultValue: false })
  statusPostToGroup: boolean;

  @IsOptional()
  @Field(() => Boolean, { defaultValue: false })
  verified: boolean;

  @IsOptional()
  @Field(() => String, { defaultValue: '' })
  idGroup: string;

  @IsOptional()
  @Field(() => Date, { defaultValue: new Date() })
  createdAt: Date;

  @IsOptional()
  @Field(() => Date, { defaultValue: new Date() })
  updatedAt: Date;
}
