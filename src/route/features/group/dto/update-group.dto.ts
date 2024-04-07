import { Field, InputType } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';

@InputType()
export class UpdateGroupDto {
  @IsOptional()
  @Field(() => String, { nullable: true })
  name: string;

  @IsOptional()
  @Field(() => String, { nullable: true })
  avatar: string;

  @IsOptional()
  @Field(() => String, { nullable: true })
  coverImage: string;

  @IsOptional()
  @Field(() => [String], { nullable: true })
  allFiles: string[];

  @IsOptional()
  @Field(() => String, { nullable: true })
  description: string;

  @IsOptional()
  @Field(() => String, { nullable: true })
  author: string;

  @IsOptional()
  @Field(() => [String], { nullable: true })
  admins: string[];

  @IsOptional()
  @Field(() => [String], { nullable: true })
  members: string[];

  @IsOptional()
  @Field(() => [String], { nullable: true })
  membersReq: string[];

  @IsOptional()
  @Field(() => Boolean, { nullable: true })
  isPrivate: boolean;

  @IsOptional()
  @Field(() => Date, { defaultValue: new Date() })
  updatedAt: Date;
}
