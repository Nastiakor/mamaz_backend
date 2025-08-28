import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Article {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'jsonb', nullable: true })
  content: Array<{ type: string; contenu: string }>;

  @Column({ unique: true, nullable: true })
  slug: string;

  @Column({ nullable: true })
  imageUrl: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  publishedAt: Date;
}
