import {
  Args,
  Context,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { FriendDto } from './dto/friend.dto';
import { FriendService } from './friend.service';
import { UserService } from '../user/user.service';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/route/auth/guard/jwt-auth.guard';
import { ResponseDto } from 'src/ts/common';
import { getUserIdFromJwt } from 'src/helper/getIdUserFromJwt';
import { CreateFriendDto } from './dto/create-friend.dto';

@Resolver(() => FriendDto)
export class FriendResolver {
  constructor(
    private readonly friendService: FriendService,
    private readonly userService: UserService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Mutation(() => ResponseDto)
  requestAddFriend(@Context() context, @Args('friendId') friendId: string) {
    const author = getUserIdFromJwt(context);
    return this.friendService.requestAddFriend(author, friendId);
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => FriendDto)
  getFriends(@Context() context) {
    const userId = getUserIdFromJwt(context);
    return this.friendService.getFriends(userId);
  }

  @Mutation(() => FriendDto)
  createFriend(
    @Args('idUser') idUser: string,
    @Args('body') body: CreateFriendDto,
  ) {
    return this.friendService.createFriend(idUser, body);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => ResponseDto)
  acceptFriendReq(@Context() context, @Args('friendId') friendId: string) {
    const author = getUserIdFromJwt(context);
    return this.friendService.acceptFriendReq(author, friendId);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => ResponseDto)
  rejectReqFriend(@Context() context, @Args('friendId') friendId: string) {
    const author = getUserIdFromJwt(context);
    return this.friendService.rejectReqFriend(author, friendId);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => ResponseDto)
  deleteFriend(@Context() context, @Args('friendId') friendId: string) {
    const author = getUserIdFromJwt(context);
    return this.friendService.deleteFriend(author, friendId);
  }

  @ResolveField()
  async author(@Parent() friend: FriendDto) {
    return this.userService.getUserById(friend.author);
  }

  @ResolveField()
  async friends(@Parent() friend: FriendDto) {
    return this.userService.getManyUsersById(friend.friends);
  }

  @ResolveField()
  async friendsReq(@Parent() friend: FriendDto) {
    return this.userService.getManyUsersById(friend.friendsReq);
  }
}
