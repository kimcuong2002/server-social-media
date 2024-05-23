import {
  Injectable,
  NotFoundException,
  BadRequestException,
  HttpStatus,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { v4 as uuid } from 'uuid';
import { Room } from './entities/room.entity';
import { Repository } from 'typeorm';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';

@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(Room) private roomRepository: Repository<Room>,
  ) {}

  async getAllRoom(idUser: string): Promise<Room[]> {
    try {
      const rooms = this.roomRepository.find({ where: { members: idUser } });
      return rooms;
    } catch (err) {
      throw new BadRequestException('Get rooms error');
    }
  }

  async getRoomById(id: string): Promise<Room> {
    try {
      return this.roomRepository.findOneBy({ id });
    } catch (err) {
      throw new BadRequestException('Get rooms error');
    }
  }

  async createRoom(body: CreateRoomDto, author: string): Promise<Room> {
    try {
      let idRoom = '';
      for (const mem of body.members) {
        idRoom = idRoom + mem;
      }
      const id = author + '-' + idRoom;
      const room = await this.roomRepository.findOne({
        where: {
          id: id,
        },
      });
      if (room) {
        return room;
      } else {
        return this.roomRepository.save({
          id: id,
          ...body,
          author: author,
        });
      }
    } catch (err) {
      throw new BadRequestException('Creating room error');
    }
  }

  async updateRoom(
    id: string,
    body: UpdateRoomDto,
  ): Promise<{ status: number; message: string }> {
    try {
      let room = await this.roomRepository.findOneBy({ id });
      if (!room) {
        throw new NotFoundException('Room not found');
      }
      room = { ...room, ...body };
      await this.roomRepository.save(room);
      return {
        status: HttpStatus.OK,
        message: 'Room updated successfully',
      };
    } catch (err) {
      throw new BadRequestException('Error updating room');
    }
  }

  async deleteRoom(id: string): Promise<{ status: number; message: string }> {
    try {
      const room = await this.roomRepository.findOneBy({ id });
      if (!room) {
        throw new NotFoundException('Room not found');
      }
      await this.roomRepository.remove(room);
      return {
        status: HttpStatus.OK,
        message: 'Room deleted successfully',
      };
    } catch (err) {
      throw new BadRequestException('Error deleting room');
    }
  }
}
