import { Column, Entity, ObjectIdColumn, PrimaryColumn } from 'typeorm';

@Entity()
export class Comment {
  @ObjectIdColumn()
  _id: string;

  @PrimaryColumn()
  id: string;

  @Column()
  content: string;

  @Column()
  postId: string;

  @Column()
  author: string;

  @Column()
  images: string[];

  @Column()
  videos: string[];

  @Column()
  likes: string[];

  @Column()
  replies: string[];

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;
}
