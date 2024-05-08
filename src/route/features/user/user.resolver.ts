import {
  Args,
  Context,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { PaginationUserDto, UserDto } from './dto/user.dto';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guard/jwt-auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { RolesGuard } from 'src/route/auth/guard/roles.guard';
import { Roles } from 'src/route/auth/decorators/roles.decorator';
import { EnumRole } from 'src/ts/enum';
import { User } from './entities/user.entity';
import {
  QueryPagination,
  ResponseDto,
  ResponseQuantityDto,
} from 'src/ts/common';
import { ResponseUserDto } from './dto/response-user.dto';
import { getUserIdFromJwt } from 'src/helper/getIdUserFromJwt';

@Resolver(() => UserDto)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Query(() => PaginationUserDto, { name: 'users' })
  getAllUsers(@Args('query') query: QueryPagination) {
    return this.userService.getUsers(query.page, query.limit);
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => ResponseUserDto)
  getInfoUser(@Context() context) {
    const userId = getUserIdFromJwt(context);
    return this.userService.getUserById(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => ResponseUserDto)
  getUserById(@Args('id') id: string) {
    return this.userService.getUserById(id);
  }

  @Query(() => ResponseDto, { name: 'user' })
  getUserByName(@Args('username') username: string) {
    return this.userService.getUserByName(username);
  }

  @Mutation(() => ResponseUserDto)
  create(@Args('body') body: CreateUserDto) {
    return this.userService.createUser(body);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => ResponseDto)
  updatFileForUser(
    @Context() context,
    @Args({ name: 'files', type: () => [String] }) files: string[],
  ) {
    const id = getUserIdFromJwt(context);
    return this.userService.updateAllFileForUser(id, files);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => ResponseDto)
  update(@Args('id') id: string, @Args('body') body: UpdateUserDto) {
    return this.userService.updateUser(id, body);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(EnumRole.ADMIN)
  @Mutation(() => ResponseDto)
  delete(@Args('id') id: string) {
    return this.userService.deleteUser(id);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(EnumRole.ADMIN)
  @Query(() => ResponseQuantityDto)
  getQuantityUser() {
    return this.userService.getQuantityUser();
  }

  @UseGuards(JwtAuthGuard)
  @Roles(EnumRole.ADMIN)
  @Mutation(() => ResponseDto)
  activeUser(@Args('id') id: string) {
    return this.userService.activeUser(id);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(EnumRole.ADMIN)
  @Mutation(() => ResponseDto)
  inActiveUser(@Args('id') id: string) {
    return this.userService.inActiveUser(id);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => ResponseDto)
  blockUser(@Context() context, @Args('idUserBlocked') idUserBlocked: string) {
    const idUser = getUserIdFromJwt(context);
    return this.userService.blockUser(idUser, idUserBlocked);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => ResponseDto)
  unBlockUser(
    @Context() context,
    @Args('idUserBlocked') idUserBlocked: string,
  ) {
    const idUser = getUserIdFromJwt(context);
    return this.userService.unBlockUser(idUser, idUserBlocked);
  }

  @ResolveField()
  async usersBlocked(@Parent() user: User) {
    return this.userService.getManyUsersById(user.usersBlocked);
  }
}
