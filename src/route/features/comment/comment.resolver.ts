import {
  Args,
  Context,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { CommentService } from './comment.service';
import { UserService } from '../user/user.service';
import { PaginationCommentDto } from './dto/common.dto';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/route/auth/guard/jwt-auth.guard';
import { CommentDto } from './dto/comment.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { getUserIdFromJwt } from 'src/helper/getIdUserFromJwt';
import { ResponseDto } from 'src/ts/common';
import { Comment } from './entities/comment.entity';

@Resolver(() => CommentDto)
export class CommentResolver {
  constructor(
    private readonly commentService: CommentService,
    private readonly userService: UserService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Query(() => PaginationCommentDto)
  getComments(
    @Args('postId') postId: string,
    @Args('page') page: number,
    @Args('limit') limit: number,
  ) {
    return this.commentService.getComments(postId, page, limit);
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => CommentDto)
  getComment(@Args('id') id: string) {
    return this.commentService.getComment(id);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => CommentDto)
  createComment(@Context() context, @Args('body') body: CreateCommentDto) {
    const userId = getUserIdFromJwt(context);
    return this.commentService.createComment(userId, body);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => ResponseDto)
  replyComment(
    @Context() context,
    @Args('idCmtParent') idCmtParent: string,
    @Args('body') body: CreateCommentDto,
  ) {
    const userId = getUserIdFromJwt(context);
    return this.commentService.replyComment(userId, idCmtParent, body);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => CommentDto)
  updateComment(@Args('id') id: string, @Args('body') body: CreateCommentDto) {
    return this.commentService.updateComment(id, body);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => ResponseDto)
  deleteComment(
    @Args('id') id: string,
    @Args('idCmtParent') idCmtParent: string | undefined,
    @Args('idPost') idPost: string,
  ) {
    return this.commentService.deleteComment(id, idCmtParent, idPost);
  }

  @ResolveField()
  async author(@Parent() comment: Comment) {
    return this.userService.getUserById(comment.author);
  }

  @ResolveField()
  async likes(@Parent() comment: Comment) {
    return this.userService.getManyUsersById(comment.likes);
  }

  @ResolveField()
  async replies(@Parent() comment: Comment) {
    return this.commentService.getManyCommentByIds(comment.replies);
  }
}
