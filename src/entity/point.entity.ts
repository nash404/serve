import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Point {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  date: string;
  @Column()
  x: number;
  @Column()
  y: number;
}
