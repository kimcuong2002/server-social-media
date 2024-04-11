import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { CommentService } from './comment.service';
import { CommentResolver } from './comment.resolver';
import { UserModule } from '../user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Comment]), UserModule],
  providers: [CommentService, CommentResolver],
  exports: [],
})
export class CommentModule {}
