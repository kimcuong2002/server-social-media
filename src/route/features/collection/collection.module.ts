import { Module } from '@nestjs/common';
import { CollectionService } from './collection.service';
import { CollectionResolver } from './collection.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Collection } from './entities/collection.entity';
import { PostModule } from '../post/post.module';

@Module({
  imports: [TypeOrmModule.forFeature([Collection]), PostModule],
  providers: [CollectionService, CollectionResolver],
  exports: [CollectionService],
})
export class CollectionModule {}
