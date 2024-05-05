import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { v4 as uuid } from 'uuid';
import { User } from './entities/user.entity';
import { MongoRepository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { EnumActive, EnumRole } from 'src/ts/enum';
import { UpdateUserDto } from './dto/update-user.dto';
import { Pagination } from 'src/ts/common';
import { SavedService } from '../saved/saved.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: MongoRepository<User>,
  ) {}

  async getUsers(page: number, limit: number): Promise<Pagination<User>> {
    const [result, count] = await this.userRepository.findAndCount({
      take: limit,
      skip: (page - 1) * limit,
    });
    return new Pagination<User>(result, count, page);
  }

  async getUserById(id: string): Promise<User> {
    return this.userRepository.findOne({
      where: {
        id,
      },
    });
  }

  async getUserByName(username: string): Promise<User> {
    return this.userRepository.findOne({
      where: {
        username,
      },
    });
  }

  async getUserByEmail(email: string): Promise<User> {
    return this.userRepository.findOne({
      where: { email },
    });
  }

  async getUserByPhone(phone: string): Promise<User> {
    return this.userRepository.findOne({
      where: {
        phone,
      },
    });
  }

  async getUsersByRole(role: EnumRole): Promise<User[]> {
    return this.userRepository.find({
      where: { role },
    });
  }

  async getManyUsersById(userIds: string[]): Promise<User[]> {
    return this.userRepository.find({
      where: {
        id: {
          $in: userIds,
        } as any,
      },
    });
  }

  async createUser(body: CreateUserDto): Promise<User> {
    try {
      const conditions = [
        { username: body.username },
        { email: body.email },
        { phone: body.phone },
      ];

      conditions.forEach(async (c) => {
        const user = await this.userRepository.findOne({ where: c });
        if (user) {
          throw new Error(
            'User with the same username, email or phone number already exists',
          );
        }
      });

      const user = await this.userRepository.save({
        id: uuid(),
        ...body,
      });

      return user;
    } catch (error) {
      throw new BadRequestException(`Error creating user`);
    }
  }

  async updateAllFileForUser(
    id: string,
    files: string[],
  ): Promise<{ status: number; message: string }> {
    try {
      let user = await this.userRepository.findOne({ where: { id } });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      user = { ...user, files: [...files, ...user.files] };
      await this.userRepository.save(user);
      return {
        status: HttpStatus.OK,
        message: 'Updated successfully',
      };
    } catch (error) {
      throw new BadRequestException('Updating files for user error');
    }
  }

  async updateUser(
    id: string,
    body: UpdateUserDto,
  ): Promise<{ status: number; message: string }> {
    try {
      let user = await this.userRepository.findOne({ where: { id } });

      if (!user) {
        throw new NotFoundException('User not found');
      }
      user = { ...user, ...body };
      await this.userRepository.save(user);

      return {
        status: HttpStatus.OK,
        message: 'User updated successfully',
      };
    } catch (error) {
      throw new BadRequestException(`Error updating user`);
    }
  }

  async deleteUser(id: string): Promise<{ status: number; message: string }> {
    try {
      const user = await this.userRepository.findOne({ where: { id } });

      if (!user) {
        throw new NotFoundException('User not found');
      }
      await this.userRepository.remove(user);

      return {
        status: HttpStatus.OK,
        message: 'User deleted successfully',
      };
    } catch (error) {
      throw new BadRequestException(`Error deleting user`);
    }
  }

  async getQuantityUser(): Promise<{ quantity: number }> {
    try {
      const quantity = await this.userRepository.count();
      return {
        quantity: quantity,
      };
    } catch (err) {
      throw new BadRequestException('Error get quantity user');
    }
  }

  async activeUser(id: string): Promise<{ status: number; message: string }> {
    try {
      const user = await this.userRepository.findOne({ where: { id } });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      user.isActive = EnumActive.ACTIVE;
      await this.userRepository.save(user);
      return {
        status: HttpStatus.OK,
        message: 'Actived user successfully',
      };
    } catch (error) {
      throw new BadRequestException('Error active user');
    }
  }

  async inActiveUser(id: string): Promise<{ status: number; message: string }> {
    try {
      const user = await this.userRepository.findOne({ where: { id } });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      user.isActive = EnumActive.INACTIVE;
      await this.userRepository.save(user);
      return {
        status: HttpStatus.OK,
        message: 'Inactived user successfully',
      };
    } catch (error) {
      throw new BadRequestException('Error inactive user');
    }
  }

  async blockUser(
    id: string,
    idUserBlocked: string,
  ): Promise<{ status: number; message: string }> {
    try {
      const user = await this.userRepository.findOne({ where: { id } });
      const userWantBlock = await this.userRepository.findOne({
        where: { id: idUserBlocked },
      });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      if (!userWantBlock) {
        throw new NotFoundException('User want block not found');
      }
      user.usersBlocked = [userWantBlock.id, ...user.usersBlocked];
      await this.userRepository.save(user);
      return {
        status: HttpStatus.OK,
        message: 'Block user successfully',
      };
    } catch (error) {
      throw new BadRequestException('Error block user');
    }
  }

  async unBlockUser(
    id: string,
    idUserBlocked: string,
  ): Promise<{ status: number; message: string }> {
    try {
      const user = await this.userRepository.findOne({ where: { id } });
      const userWantUnBlock = await this.userRepository.findOne({
        where: { id: idUserBlocked },
      });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      if (!userWantUnBlock) {
        throw new NotFoundException('User want unblock not found');
      }
      user.usersBlocked = user.usersBlocked.filter(
        (id) => id !== userWantUnBlock.id,
      );
      await this.userRepository.save(user);
      return {
        status: HttpStatus.OK,
        message: 'Unblock user successfully',
      };
    } catch (error) {
      throw new BadRequestException('Error unblock user');
    }
  }

  async sendReqFriend(
    author: string,
    idFriend: string,
  ): Promise<{ status: number; message: string }> {
    try {
      const userWantAddFriend = await this.userRepository.findOne({
        where: { id: idFriend },
      });
      if (!userWantAddFriend) {
        throw new NotFoundException('User want add friend not found');
      }
      userWantAddFriend.friendsReq = [author, ...userWantAddFriend.friendsReq];
      await this.userRepository.save(userWantAddFriend);
      return {
        status: HttpStatus.OK,
        message: 'Send request friend successfully',
      };
    } catch (error) {
      throw new BadRequestException('Error send request friend');
    }
  }

  async acceptReqFriend(
    author: string,
    idFriend: string,
  ): Promise<{ status: number; message: string }> {
    try {
      const user = await this.userRepository.findOne({ where: { id: author } });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      const userWantAddFriend = await this.userRepository.findOne({
        where: { id: idFriend },
      });
      if (!userWantAddFriend) {
        throw new NotFoundException('User want add friend not found');
      }
      userWantAddFriend.friends = [author, ...userWantAddFriend.friends];
      user.friends = [idFriend, ...user.friends];
      user.friendsReq = user.friendsReq.filter((id) => id !== idFriend);
      await this.userRepository.save(userWantAddFriend);
      await this.userRepository.save(user);
      return {
        status: HttpStatus.OK,
        message: 'Accept request friend successfully',
      };
    } catch (error) {
      throw new BadRequestException('Error accept request friend');
    }
  }

  async rejectReqFriend(
    author: string,
    idFriend: string,
  ): Promise<{ status: number; message: string }> {
    try {
      const user = await this.userRepository.findOne({ where: { id: author } });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      const userWantAddFriend = await this.userRepository.findOne({
        where: { id: idFriend },
      });
      if (!userWantAddFriend) {
        throw new NotFoundException('User want add friend not found');
      }
      user.friendsReq = user.friendsReq.filter((id) => id !== idFriend);
      await this.userRepository.save(user);
      return {
        status: HttpStatus.OK,
        message: 'Reject request friend successfully',
      };
    } catch (error) {
      throw new BadRequestException('Error reject request friend');
    }
  }

  async deleteFriend(
    author: string,
    idFriend: string,
  ): Promise<{ status: number; message: string }> {
    try {
      const user = await this.userRepository.findOne({ where: { id: author } });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      const userWantUnfriend = await this.userRepository.findOne({
        where: { id: idFriend },
      });
      if (!userWantUnfriend) {
        throw new NotFoundException('User want unfriend not found');
      }
      user.friends = user.friends.filter((id) => id !== idFriend);
      await this.userRepository.save(user);
      return {
        status: HttpStatus.OK,
        message: 'Delete friend successfully',
      };
    } catch (error) {
      throw new BadRequestException('Error delete friend');
    }
  }
}
