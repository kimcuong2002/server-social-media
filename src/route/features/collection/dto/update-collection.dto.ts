import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class UpdateCollectionDto {
  @IsNotEmpty()
  @Field(() => String)
  name: string;

  @IsNotEmpty()
  @Field(() => String)
  avatar: string;
}
