import { Field, ObjectType } from '@nestjs/graphql';
import { CommentDto } from './comment.dto';

@ObjectType()
export class PaginationCommentDto {
  @Field(() => [CommentDto])
  data: CommentDto[];

  @Field()
  total: number;

  @Field()
  page: number;
}
