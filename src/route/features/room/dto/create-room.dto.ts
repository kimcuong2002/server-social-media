import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional } from 'class-validator';

@InputType()
export class CreateRoomDto {
  @IsNotEmpty()
  @Field()
  name: string;

  @IsNotEmpty()
  @Field(() => [String])
  members: string[];

  @IsOptional()
  @Field(() => Date, { defaultValue: new Date() })
  createdAt: Date;

  @IsOptional()
  @Field(() => Date, { defaultValue: new Date() })
  updatedAt: Date;
}
