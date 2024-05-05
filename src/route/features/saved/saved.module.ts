import { Module } from '@nestjs/common';
import { SavedService } from './saved.service';
import { SavedResolver } from './saved.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Saved } from './entities/saved.entity';
import { PostModule } from '../post/post.module';
import { CollectionModule } from '../collection/collection.module';

@Module({
  imports: [TypeOrmModule.forFeature([Saved]), PostModule, CollectionModule],
  providers: [SavedService, SavedResolver],
  exports: [SavedService],
})
export class SavedModule {}
