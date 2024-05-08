import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Friend } from './entities/friend.entity';
import { FriendService } from './friend.service';
import { FriendResolver } from './friend.resolver';
import { UserModule } from '../user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Friend]), UserModule],
  providers: [FriendService, FriendResolver],
  exports: [],
})
export class FriendModule {}
