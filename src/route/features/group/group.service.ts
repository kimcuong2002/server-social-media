import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { InjectRepository } from '@nestjs/typeorm';
import { Group } from './enitites/group.entity';
import { Repository } from 'typeorm';
import { Pagination, ParamsQueryDto } from 'src/ts/common';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';

@Injectable()
export class GroupService {
  constructor(
    @InjectRepository(Group) private groupRepository: Repository<Group>,
  ) {}

  async getGroups(
    filter: ParamsQueryDto,
    page = 1,
    limit = 10,
  ): Promise<Pagination<Group>> {
    const query = filter.query ? JSON.parse(filter.query) : {};
    const skip = (page - 1) * limit;

    const [result, count] = await this.groupRepository.findAndCount({
      where: query,
      skip,
      take: limit,
    });

    return new Pagination<Group>(result, count, page);
  }

  async getGroupById(id: string): Promise<Group> {
    try {
      const group = await this.groupRepository.findOne({ where: { id } });
      if (!group) {
        throw new NotFoundException('Group not found');
      }
      return group;
    } catch (error) {
      throw new BadRequestException('Error get group');
    }
  }

  async createGroup(body: CreateGroupDto, idAuthor: string): Promise<Group> {
    try {
      return this.groupRepository.save({
        id: uuid(),
        ...body,
        author: idAuthor,
        admins: [idAuthor],
        members: [idAuthor],
      });
    } catch (error) {
      throw new BadRequestException('Error creating group');
    }
  }

  async updateGroup(
    id: string,
    idUser: string,
    body: UpdateGroupDto,
  ): Promise<{ status: number; message: string }> {
    try {
      let group = await this.groupRepository.findOne({ where: { id } });

      if (!group) {
        throw new NotFoundException('Group not found');
      }

      const isAdmin = group.admins.includes(idUser);

      if (!isAdmin) {
        throw new BadRequestException('You are not admin of this group');
      }

      group = { ...group, ...body };
      await this.groupRepository.save(group);

      return {
        status: HttpStatus.OK,
        message: 'Group updated successfully',
      };
    } catch (error) {
      throw new BadRequestException('Error updating group');
    }
  }

  async deleteGroup(
    id: string,
    idUser: string,
  ): Promise<{ status: number; message: string }> {
    try {
      const group = await this.groupRepository.findOne({ where: { id } });

      if (!group) {
        throw new NotFoundException('Group not found');
      }

      const isAdmin = group.admins.includes(idUser);
      if (!isAdmin) {
        throw new BadRequestException('You are not admin of this group');
      }
      await this.groupRepository.remove(group);

      return {
        status: HttpStatus.OK,
        message: 'Group deleted successfully',
      };
    } catch (error) {
      throw new BadRequestException(`Error deleting group`);
    }
  }

  async joinGroup(
    idGroup: string,
    idUser: string,
  ): Promise<{ status: number; message: string }> {
    try {
      const group = await this.groupRepository.findOne({
        where: { id: idGroup },
      });
      if (!group) {
        throw new NotFoundException('Group not found');
      }
      group.membersReq = [idUser, ...group.membersReq];
      await this.groupRepository.save(group);
      return {
        status: HttpStatus.OK,
        message: 'Join group successfully',
      };
    } catch (error) {
      throw new BadRequestException('Error joining group');
    }
  }

  async acceptMemberReqJoinGroup(
    idGroup: string,
    idUser: string,
    idMemberReq: string,
  ): Promise<{ status: number; message: string }> {
    try {
      const group = await this.groupRepository.findOne({
        where: { id: idGroup },
      });
      if (!group) {
        throw new NotFoundException('Group not found');
      }
      group.members = [idUser, ...group.members];
      group.membersReq = group.membersReq.filter(
        (i: string) => i !== idMemberReq,
      );
      await this.groupRepository.save(group);
      return {
        status: HttpStatus.OK,
        message: 'Accept member req join group successfully',
      };
    } catch (error) {
      throw new BadRequestException('Error accept member req join group');
    }
  }

  async leaveGroup(
    idGroup: string,
    idUser: string,
  ): Promise<{ status: number; message: string }> {
    try {
      const group = await this.groupRepository.findOne({
        where: { id: idGroup },
      });
      if (!group) {
        throw new NotFoundException('Group not found');
      }
      group.members = group.members.filter((i: string) => i !== idUser);
      await this.groupRepository.save(group);
      return {
        status: HttpStatus.OK,
        message: 'Leave group successfully',
      };
    } catch (error) {
      throw new BadRequestException('Error leaving group');
    }
  }
}
