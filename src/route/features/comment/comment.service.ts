import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { v4 as uuid } from 'uuid';
import { Pagination } from 'src/ts/common';
import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment) private commentRepository: Repository<Comment>,
  ) {}

  async getComments(
    postId: string,
    page = 1,
    limit = 10,
  ): Promise<Pagination<Comment>> {
    const skip = (page - 1) * limit;
    const [result, count] = await this.commentRepository.findAndCount({
      where: { postId: postId },
      skip,
      take: limit,
    });

    return new Pagination<Comment>(result, count, page);
  }

  async getComment(id: string): Promise<Comment> {
    try {
      const comment = await this.commentRepository.findOne({ where: { id } });
      if (!comment) {
        throw new NotFoundException('Comment not found');
      }
      return comment;
    } catch (error) {
      throw new BadRequestException('Error get comment');
    }
  }

  async getManyCommentByIds(ids: string[]): Promise<Comment[]> {
    try {
      return await this.commentRepository.find({
        where: { replies: { $in: ids } as any },
      });
    } catch (error) {
      throw new BadRequestException('Error get comments');
    }
  }

  async createComment(body: CreateCommentDto): Promise<Comment> {
    try {
      return await this.commentRepository.save({
        id: uuid(),
        ...body,
      });
    } catch (error) {
      throw new BadRequestException('Error creating comment');
    }
  }

  async replyComment(
    idCmtParent: string,
    body: CreateCommentDto,
  ): Promise<{ status: number; message: string }> {
    try {
      const comment = await this.createComment(body);
      const commentParent = await this.commentRepository.findOne({
        where: { id: idCmtParent },
      });
      commentParent.replies = [...commentParent.replies, comment.id];
      await this.commentRepository.save(commentParent);
      return {
        status: HttpStatus.OK,
        message: 'Comment created successfully',
      };
    } catch (error) {
      throw new BadRequestException('Error creating comment');
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
      comment = { ...comment, ...body };
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
    idCmtParent?: string,
  ): Promise<{ status: number; message: string }> {
    try {
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
      return {
        status: HttpStatus.OK,
        message: 'Comment deleted successfully',
      };
    } catch (error) {
      throw new BadRequestException('Error deleting comment');
    }
  }
}
