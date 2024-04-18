import {
  Args,
  Context,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { GroupService } from './group.service';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/route/auth/guard/jwt-auth.guard';
import { PaginationGroupDto } from './dto/common.dto';
import { ParamsQueryDto, ResponseDto } from 'src/ts/common';
import { GroupDto } from './dto/group.dto';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { Group } from './enitites/group.entity';
import { UserService } from '../user/user.service';
import { getUserIdFromJwt } from 'src/helper/getIdUserFromJwt';

@Resolver(() => GroupDto)
export class GroupResolver {
  constructor(
    private readonly groupService: GroupService,
    private readonly userService: UserService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Query(() => PaginationGroupDto)
  getGroups(
    @Args('filter') filter: ParamsQueryDto,
    @Args('page') page: number,
    @Args('limit') limit: number,
  ) {
    return this.groupService.getGroups(filter, page, limit);
  }

  @Query(() => GroupDto)
  getGroupById(@Args('id') id: string) {
    return this.groupService.getGroupById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => GroupDto)
  createGroup(@Args('body') body: CreateGroupDto, @Context() context) {
    const userId = getUserIdFromJwt(context);
    return this.groupService.createGroup(body, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => ResponseDto)
  updateGroup(
    @Args('id') id: string,
    @Args('body') body: UpdateGroupDto,
    @Context() context,
  ) {
    const userId = getUserIdFromJwt(context);
    return this.groupService.updateGroup(id, userId, body);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => ResponseDto)
  deleteGroup(@Args('id') id: string, @Context() context) {
    const userId = getUserIdFromJwt(context);
    return this.groupService.deleteGroup(id, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => ResponseDto)
  joinGroup(@Args('id') id: string, @Context() context) {
    const userId = getUserIdFromJwt(context);
    return this.groupService.joinGroup(id, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => ResponseDto)
  acceptMemberReqJoinGroup(
    @Args('idGroup') idGroup: string,
    @Args('idMemberReq') idMemberReq: string,
    @Context() context,
  ) {
    const userId = getUserIdFromJwt(context);
    return this.groupService.acceptMemberReqJoinGroup(
      idGroup,
      userId,
      idMemberReq,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => ResponseDto)
  leaveGroup(@Args('id') id: string, @Context() context) {
    const userId = getUserIdFromJwt(context);
    return this.groupService.leaveGroup(id, userId);
  }

  @ResolveField()
  author(@Parent() group: Group) {
    return this.userService.getUserById(group.author);
  }

  @ResolveField()
  admins(@Parent() group: Group) {
    return this.userService.getManyUsersById(group.admins);
  }

  @ResolveField()
  members(@Parent() group: Group) {
    return this.userService.getManyUsersById(group.members);
  }

  @ResolveField()
  membersReq(@Parent() group: Group) {
    return this.userService.getManyUsersById(group.membersReq);
  }
}
