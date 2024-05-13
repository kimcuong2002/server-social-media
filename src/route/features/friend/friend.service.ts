import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { InjectRepository } from '@nestjs/typeorm';
import { Friend } from './entities/friend.entity';
import { Repository } from 'typeorm';
import { CreateFriendDto } from './dto/create-friend.dto';

@Injectable()
export class FriendService {
  constructor(
    @InjectRepository(Friend) private friendRepository: Repository<Friend>,
  ) {}

  async getFriends(id: string): Promise<Friend> {
    return this.friendRepository.findOne({
      where: {
        author: id,
      },
    });
  }

  async createFriend(author: string, body: CreateFriendDto): Promise<Friend> {
    try {
      return this.friendRepository.save({
        id: uuid(),
        author,
        ...body,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    } catch (error) {
      throw new BadRequestException('Error creating friend');
    }
  }

  async requestAddFriend(
    author: string,
    friendId: string,
  ): Promise<{ status: number; message: string }> {
    try {
      const friend = await this.friendRepository.findOne({
        where: {
          author: friendId,
        },
      });
      friend.friendsReq = [author, ...friend.friendsReq];
      await this.friendRepository.save({
        ...friend,
        updatedAt: new Date(),
      });
      return {
        status: HttpStatus.OK,
        message: 'Friend request sent successfully',
      };
    } catch (error) {
      throw new BadRequestException('Error adding friend');
    }
  }

  async acceptFriendReq(
    author: string,
    friendId: string,
  ): Promise<{ status: number; message: string }> {
    try {
      const friendOfAuthor = await this.friendRepository.findOne({
        where: {
          author: author,
        },
      });

      const friendOfFriendOfAuthor = await this.friendRepository.findOne({
        where: {
          author: friendId,
        },
      });

      if (friendOfAuthor && friendOfFriendOfAuthor) {
        friendOfAuthor.friends = [
          friendOfFriendOfAuthor.author,
          ...friendOfAuthor.friends,
        ];
        friendOfFriendOfAuthor.friends = [
          friendOfAuthor.author,
          ...friendOfFriendOfAuthor.friends,
        ];

        friendOfAuthor.friendsReq = friendOfAuthor.friendsReq.filter(
          (id) => id !== friendId,
        );

        await this.friendRepository.save({
          ...friendOfAuthor,
          updatedAt: new Date(),
        });

        await this.friendRepository.save({
          ...friendOfFriendOfAuthor,
          updatedAt: new Date(),
        });

        return {
          status: HttpStatus.OK,
          message: 'Friend added successfully',
        };
      }
    } catch (error) {
      throw new BadRequestException('Error adding friend');
    }
  }

  async rejectReqFriend(
    author: string,
    friendId: string,
  ): Promise<{ status: number; message: string }> {
    try {
      const friendOfAuthor = await this.friendRepository.findOne({
        where: {
          author: author,
        },
      });
      if (friendOfAuthor) {
        friendOfAuthor.friendsReq = friendOfAuthor.friendsReq.filter(
          (id) => id !== friendId,
        );
        await this.friendRepository.save({
          ...friendOfAuthor,
          updatedAt: new Date(),
        });
        return {
          status: HttpStatus.OK,
          message: 'Reject request friend successfully',
        };
      }
    } catch (error) {
      throw new BadRequestException('Error reject request friend');
    }
  }

  async deleteFriend(
    author: string,
    friendId: string,
  ): Promise<{ status: number; message: string }> {
    try {
      const friendOfAuthor = await this.friendRepository.findOne({
        where: {
          author: author,
        },
      });

      const friendOfFriendOfAuthor = await this.friendRepository.findOne({
        where: {
          author: friendId,
        },
      });

      if (friendOfAuthor && friendOfFriendOfAuthor) {
        friendOfFriendOfAuthor.friends = friendOfFriendOfAuthor.friends.filter(
          (id) => id !== author,
        );
        friendOfAuthor.friends = friendOfAuthor.friends.filter(
          (id) => id !== friendId,
        );
        await this.friendRepository.save({
          ...friendOfFriendOfAuthor,
          updatedAt: new Date(),
        });
        await this.friendRepository.save({
          ...friendOfAuthor,
          updatedAt: new Date(),
        });
        return {
          status: HttpStatus.OK,
          message: 'Delete friend successfully',
        };
      }
    } catch (error) {
      throw new BadRequestException('Error delete friend');
    }
  }
}
