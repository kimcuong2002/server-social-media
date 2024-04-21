import { Field, ID, ObjectType } from '@nestjs/graphql';
import { UserDto } from '../../user/dto/user.dto';

@ObjectType('Comment')
export class CommentDto {
  @Field(() => ID)
  id: string;

  @Field()
  content: string;

  @Field()
  postId: string;

  @Field(() => UserDto)
  author: string;

  @Field(() => [String])
  images: string[];

  @Field(() => [String])
  videos: string[];

  @Field(() => [UserDto])
  likes: string[];

  @Field(() => [CommentDto])
  replies: string[];

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
