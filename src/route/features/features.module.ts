import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { TopicModule } from './topic/topic.module';
import { PostModule } from './post/post.module';
import { GroupModule } from './group/group.module';
import { SavedModule } from './saved/saved.module';
import { CollectionModule } from './collection/collection.module';
import { MessageModule } from './message/message.module';
import { RoomModule } from './room/room.module';
import { CommentModule } from './comment/comment.module';
import { MarketModule } from './market/market.module';
import { FriendModule } from './friend/friend.module';
import { CategoryModule } from './category/category.module';

@Module({
  imports: [
    UserModule,
    TopicModule,
    PostModule,
    GroupModule,
    SavedModule,
    CollectionModule,
    MessageModule,
    RoomModule,
    CommentModule,
    MarketModule,
    FriendModule,
    CategoryModule,
  ],
})
export class FeatureModule {}
