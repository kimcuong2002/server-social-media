import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { v4 as uuid } from 'uuid';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { EnumActive, EnumRole } from 'src/ts/enum';
import { UpdateUserDto } from './dto/update-user.dto';
import { Pagination } from 'src/ts/common';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async getUsers(page: number, limit: number): Promise<Pagination<User>> {
    const [result, count] = await this.userRepository.findAndCount({
      take: limit,
      skip: (page - 1) * limit,
    });
    return new Pagination<User>(result, count, page);
  }

  async getUserById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: {
        id,
      },
    });
    if (!user) {
      throw new Error(`User with ID ${id} not found`);
    }
    return user;
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
    if (userIds.length === 0) return [];
    return this.userRepository.find({
      where: {
        id: { $in: userIds } as any,
      },
    });
  }

  async createUser(body: CreateUserDto): Promise<User> {
    try {
      // const conditions = [
      //   { username: body.username },
      //   { email: body.email },
      //   { phone: body.phone },
      // ];

      // conditions.forEach(async (c) => {
      //   const user = await this.userRepository.findOne({ where: c });
      //   if (user) {
      //     throw new HttpException(
      //       {
      //         status: HttpStatus.BAD_REQUEST,
      //         error: `User with the same ${Object.keys(c)[0]} already exists`,
      //       },
      //       HttpStatus.BAD_REQUEST,
      //     );
      //   }
      // });

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
}
