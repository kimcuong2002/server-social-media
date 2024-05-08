import { Field, InputType } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';

@InputType()
export class CreateFriendDto {
  @IsOptional()
  @Field(() => [String], { defaultValue: [] })
  friends: string[];

  @IsOptional()
  @Field(() => [String], { defaultValue: [] })
  friendsReq: string[];

  @IsOptional()
  @Field(() => Date, { defaultValue: new Date() })
  createdAt: Date;

  @IsOptional()
  @Field(() => Date, { defaultValue: new Date() })
  updatedAt: Date;
}
