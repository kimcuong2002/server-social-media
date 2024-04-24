import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional } from 'class-validator';

@InputType()
export class UpdatePostDto {
  @IsOptional()
  @Field({ nullable: true })
  topic: string;

  @IsOptional()
  @Field({ nullable: true })
  content: string;

  @IsOptional()
  @Field(() => [String], { nullable: true })
  images: string[];

  @IsOptional()
  @Field(() => [String], { nullable: true })
  video: string[];

  @IsOptional()
  @Field(() => Boolean, { nullable: true })
  isGhim: boolean;

  @IsOptional()
  @Field(() => Number, { nullable: true })
  quantityComments: number;

  @IsOptional()
  @Field(() => [String], { nullable: true })
  usersLiked: string[];

  @IsOptional()
  @Field(() => [String], { nullable: true })
  authorsPostShared: string[];

  @IsOptional()
  @Field(() => Boolean, { nullable: true })
  statusPostToGroup: boolean;

  @IsOptional()
  @Field(() => Boolean, { nullable: true })
  verified: boolean;

  @IsOptional()
  @Field(() => String, { nullable: true })
  idGroup: string;

  @IsOptional()
  @Field(() => Date, { nullable: true })
  createdAt: Date;

  @IsOptional()
  @Field(() => Date, { nullable: true })
  updatedAt: Date;
}
