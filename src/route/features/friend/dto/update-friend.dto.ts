import { Field, InputType } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';

@InputType()
export class UpdateFriendDto {
  @IsOptional()
  @Field(() => [String], { nullable: true })
  friends: string[];

  @IsOptional()
  @Field(() => [String], { nullable: true })
  friendsReq: string[];

  @IsOptional()
  @Field(() => Date, { defaultValue: new Date() })
  updatedAt: Date;
}
