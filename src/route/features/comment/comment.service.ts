import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { v4 as uuid } from 'uuid';
import { Pagination } from 'src/ts/common';
import { MongoRepository } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { PostService } from '../post/post.service';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private commentRepository: MongoRepository<Comment>,
    private readonly postService: PostService,
  ) {}

  async getComments(
    postId: string,
    page = 1,
    limit = 1000,
  ): Promise<Pagination<Comment>> {
    const skip = (page - 1) * limit;
    const [result, count] = await this.commentRepository.findAndCount({
      where: { postId: postId },
      skip,
      take: limit,
    });

    const cmts: Comment[] = [];
    result.forEach((item: Comment) => {
      if (
        !result.some((otherComment) => otherComment.replies.includes(item.id))
      ) {
        cmts.push(item);
      }
    });

    return new Pagination<Comment>(cmts, count, page);
  }

  async getQuantityCommentOfPost(postId: string): Promise<number> {
    return await this.commentRepository.count({ where: { postId: postId } });
  }

  async getComment(id: string): Promise<Comment> {
    try {
      const comment = await this.commentRepository.findOne({ where: { id } });
      console.log(comment);
      if (!comment) {
        throw new NotFoundException('Comment not found');
      }
      return comment;
    } catch (error) {
      throw new BadRequestException('Error get comment');
    }
  }

  async getManyCommentByIds(ids: string[]): Promise<Comment[]> {
    return this.commentRepository.find({
      where: { id: { $in: ids } as any },
    });
  }

  async createComment(
    author: string,
    body: CreateCommentDto,
  ): Promise<Comment> {
    try {
      const post = await this.postService.getPostById(body.postId);
      if (!post) {
        throw new NotFoundException('Post not found');
      }
      const comment = {
        id: uuid(),
        ...body,
        author: author,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const newCmt = await this.commentRepository.save(comment);
      this.postService.updateQuanityComments(post.id, 'increment');
      return newCmt;
    } catch (error) {
      throw new BadRequestException('Error creating comment');
    }
  }

  async replyComment(
    author: string,
    idCmtParent: string,
    body: CreateCommentDto,
  ): Promise<{ status: number; message: string }> {
    try {
      const comment = await this.createComment(author, body);
      const commentParent = await this.commentRepository.findOne({
        where: { id: idCmtParent },
      });
      commentParent.replies = [...commentParent.replies, comment.id];
      await this.commentRepository.save({ ...commentParent });
      return {
        status: HttpStatus.OK,
        message: 'Comment replied successfully',
      };
    } catch (error) {
      throw new BadRequestException('Error replying comment');
    }
  }

  async updateComment(
    id: string,
    body: CreateCommentDto,
  ): Promise<{ status: number; message: string }> {
    try {
      let comment = await this.commentRepository.findOne({ where: { id } });
      if (!comment) {
        throw new NotFoundException('Comment not found');
      }
      comment = { ...comment, ...body, updatedAt: new Date() };
      await this.commentRepository.save(comment);
      return {
        status: HttpStatus.OK,
        message: 'Comment updated successfully',
      };
    } catch (error) {
      throw new BadRequestException('Error updating comment');
    }
  }

  async deleteComment(
    id: string,
    idCmtParent: string,
    idPost: string,
  ): Promise<{ status: number; message: string }> {
    try {
      const post = await this.postService.getPostById(idPost);
      if (!post) {
        throw new NotFoundException('Post not found');
      }
      const comment = await this.commentRepository.findOne({ where: { id } });
      if (idCmtParent) {
        const commentParent = await this.commentRepository.findOne({
          where: { id: idCmtParent },
        });
        if (!commentParent) {
          throw new NotFoundException('Comment parent not found');
        }
        commentParent.replies = commentParent.replies.filter(
          (id) => id !== comment.id,
        );
        await this.commentRepository.save(commentParent);
      }
      if (!comment) {
        throw new NotFoundException('Comment not found');
      }
      await this.commentRepository.remove(comment);
      this.postService.updateQuanityComments(comment.postId, 'decrement');
      return {
        status: HttpStatus.OK,
        message: 'Comment deleted successfully',
      };
    } catch (error) {
      throw new BadRequestException('Error deleting comment');
    }
  }
}
