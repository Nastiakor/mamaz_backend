import { Controller, Get, Post, Body, Put, Param } from '@nestjs/common';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { Article } from './entities/article.entity';
import { UpdateArticleDto } from './dto/update-article.dto';

@Controller('articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Post()
  create(@Body() data: CreateArticleDto): Promise<Article> {
    return this.articleService.create(data);
  }

  @Get()
  getAll(): Promise<Article[]> {
    return this.articleService.findAll();
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateDto: UpdateArticleDto) {
    return this.articleService.update(+id, updateDto);
  }
}
