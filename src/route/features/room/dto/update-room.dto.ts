import { Field, InputType } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';

@InputType()
export class UpdateRoomDto {
  @IsOptional()
  @Field(() => String, { nullable: true })
  name: string;

  @IsOptional()
  @Field(() => [String], { nullable: true })
  members: string[];

  @IsOptional()
  @Field(() => Date, { defaultValue: new Date() })
  updatedAt: Date;
}
