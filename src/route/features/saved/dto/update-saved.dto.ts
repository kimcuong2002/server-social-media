import { Field, InputType } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';

@InputType()
export class UpdatedSavedDto {
  @IsOptional()
  @Field(() => [String], { nullable: true })
  posts: string[];

  @IsOptional()
  @Field(() => [String], { nullable: true })
  markets: string[];

  @IsOptional()
  @Field(() => Date, { defaultValue: new Date() })
  updatedAt: Date;
}
