import { Column, Entity, ObjectIdColumn, PrimaryColumn } from 'typeorm';

@Entity()
export class Friend {
  @ObjectIdColumn()
  _id: string;

  @PrimaryColumn()
  id: string;

  @Column()
  author: string;

  @Column()
  friends: string[];

  @Column()
  friendsReq: string[];

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;
}
