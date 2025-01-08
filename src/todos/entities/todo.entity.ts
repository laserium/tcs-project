import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  CreateDateColumn, 
  UpdateDateColumn,
  
  } from 'typeorm';

@Entity()
export class Todo {
  @PrimaryGeneratedColumn()
  id: string;

  @Column('varchar')
  name: string;

  @Column('text', {default: ''})
  description: string;

  @Column('timestamp', {default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date | string;

  @Column('timestamp', {nullable: true })
  updatedAt: Date | string | null;

  @Column('timestamp', {nullable: true })
  startDateAt: Date | string | null;

  @Column('timestamp', {nullable: true })
  dueDateAt: Date | string | null;

  @Column({
    type: 'enum',
    enum: ['IN PROCESS', 'DONE', 'IDLE'],
    default: 'IDLE',
  })
  status: 'IN PROCESS' | 'DONE' | 'IDLE';
}

export enum TodoStatus {
  IN_PROCESS = 'IN PROCESS',
  DONE = 'DONE',
  IDLE = 'IDLE',
}
