import {
  Args,
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
  createComment(@Args('body') body: CreateCommentDto) {
    return this.commentService.createComment(body);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => CommentDto)
  replyComment(
    @Args('idCmtParent') idCmtParent: string,
    @Args('body') body: CreateCommentDto,
  ) {
    return this.commentService.replyComment(idCmtParent, body);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => CommentDto)
  updateComment(@Args('id') id: string, @Args('body') body: CreateCommentDto) {
    return this.commentService.updateComment(id, body);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => CommentDto)
  deleteComment(
    @Args('id') id: string,
    @Args('idCmtParent') idCmtParent: string | undefined,
  ) {
    return this.commentService.deleteComment(id, idCmtParent);
  }

  @ResolveField()
  author(@Parent() comment: CommentDto) {
    return this.userService.getUserById(comment.author);
  }

  @ResolveField()
  likes(@Parent() comment: CommentDto) {
    return this.userService.getManyUsersById(comment.likes);
  }

  @ResolveField()
  replies(@Parent() comment: CommentDto) {
    return this.commentService.getManyCommentByIds(comment.replies);
  }
}
