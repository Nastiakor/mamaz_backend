import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

console.log('User entity loaded');
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;
}
