import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { EnumTypeMessage } from 'src/ts/enum';

@InputType()
export class UpdateMessageDto {
  @IsNotEmpty()
  @Field(() => String)
  content: string;

  @IsOptional()
  @Field(() => Date, { defaultValue: new Date() })
  updatedAt: Date;
}
