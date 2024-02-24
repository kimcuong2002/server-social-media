import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { TopicModule } from './topic/topic.module';
import { PostModule } from './post/post.module';
import { GroupModule } from './group/group.module';
import { SavedModule } from './saved/saved.module';
import { CollectionModule } from './collection/collection.module';
import { MessageModule } from './message/message.module';
import { RoomModule } from './room/room.module';

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
  ],
})
export class FeatureModule {}
