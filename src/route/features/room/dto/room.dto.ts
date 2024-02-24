import { Field, ID, ObjectType } from '@nestjs/graphql';
import { UserDto } from '../../user/dto/user.dto';

@ObjectType('Room')
export class RoomDto {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field(() => UserDto)
  author: string;

  @Field(() => [UserDto])
  members: string[];

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
