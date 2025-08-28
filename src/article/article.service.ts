import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Article } from './article.entity';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { NotFoundException } from '@nestjs/common';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    private articleRepo: Repository<Article>,
  ) {}

  async findAll(): Promise<Article[]> {
    return this.articleRepo.find({
      order: { publishedAt: 'DESC' },
    });
  }

  async create(data: CreateArticleDto): Promise<Article> {
    const article = this.articleRepo.create(data);
    return this.articleRepo.save(article);
  }

  async update(id: number, updateDto: UpdateArticleDto): Promise<Article> {
    await this.articleRepo.update(id, updateDto);
    const article = await this.articleRepo.findOneBy({ id });

    if (!article) {
      throw new NotFoundException(`Article with ID ${id} not found`);
    }

    return article;
  }
}
