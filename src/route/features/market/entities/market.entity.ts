import { Column, Entity, ObjectIdColumn, PrimaryColumn } from 'typeorm';

@Entity()
export class Market {
  @ObjectIdColumn()
  _id: string;

  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  author: string;

  @Column()
  images: string[];

  @Column()
  videos: string[];

  @Column()
  description: string;

  @Column()
  price: string;

  @Column()
  category: number;

  @Column()
  location: string;

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;
}
