import { Field, ID, ObjectType } from '@nestjs/graphql';
import { UserDto } from '../../user/dto/user.dto';

@ObjectType('Friend')
export class FriendDto {
  @Field(() => ID)
  id: string;

  @Field(() => UserDto)
  author: string;

  @Field(() => [UserDto])
  friends: string[];

  @Field(() => [UserDto])
  friendsReq: string[];

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
