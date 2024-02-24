import {
  Args,
  Context,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { RoomService } from './room.service';
import { RoomDto } from './dto/room.dto';
import { CreateRoomDto } from './dto/create-room.dto';
import { UserService } from '../user/user.service';
import { Room } from './entities/room.entity';
import { getUserIdFromJwt } from 'src/helper/getIdUserFromJwt';
import { ResponseDto } from 'src/ts/common';
import { UpdateRoomDto } from './dto/update-room.dto';
import { JwtAuthGuard } from 'src/route/auth/guard/jwt-auth.guard';
import { UseGuards } from '@nestjs/common';

@Resolver(() => RoomDto)
export class RoomResolver {
  constructor(
    private readonly roomService: RoomService,
    private readonly userService: UserService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Query(() => [RoomDto])
  getAllRoom(@Args('idUser') idUser: string) {
    return this.roomService.getAllRoom(idUser);
  }

  @Query(() => RoomDto)
  @UseGuards(JwtAuthGuard)
  getRoomById(@Args('id') id: string) {
    return this.roomService.getRoomById(id);
  }

  @Mutation(() => RoomDto)
  @UseGuards(JwtAuthGuard)
  createRoom(@Args('body') body: CreateRoomDto, @Context() context) {
    const author = getUserIdFromJwt(context);
    return this.roomService.createRoom(body, author);
  }

  @Mutation(() => ResponseDto)
  @UseGuards(JwtAuthGuard)
  updateRoom(@Args('id') id: string, @Args('body') body: UpdateRoomDto) {
    return this.roomService.updateRoom(id, body);
  }

  @Mutation(() => ResponseDto)
  @UseGuards(JwtAuthGuard)
  deleteRoom(@Args('id') id: string) {
    return this.roomService.deleteRoom(id);
  }

  @ResolveField()
  members(@Parent() room: Room) {
    return this.userService.getManyUsersById(room.members);
  }

  @ResolveField()
  author(@Parent() room: Room) {
    return this.userService.getUserById(room.author);
  }
}
