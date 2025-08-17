import { Injectable } from '@nestjs/common';
import { CreateVideoDto } from './dto/create-video.dto';
import { UpdateVideoDto } from './dto/update-video.dto';
import * as path from 'path';

@Injectable()
export class VideosService {
  // Map IDs to local file paths
  private readonly fileMap: Record<number, string> = {
    1: path.join(process.cwd(), 'storage', 'videos', 'le_perinee_mon_ami.mp4'),
    2: path.join(process.cwd(), 'storage', 'videos', 'notre_perinee.mp4'),
  };

  // Metadata returned to the app
  list() {
    return [
      {
        id: 1,
        title: 'Le périnée mon ami',
        thumbnailUrl: 'http://localhost:3000/videos/thumbnail/1',
        videoUrl: 'http://localhost:3000/videos/stream/1',
        publishedAt: '2024-07-01T10:00:00.000Z',
      },
      {
        id: 2,
        title: 'Notre périnée',
        thumbnailUrl: 'http://localhost:3000/videos/thumbnail/2',
        videoUrl: 'http://localhost:3000/videos/stream/2',
        publishedAt: '2024-07-05T10:00:00.000Z',
      },
      {
        id: 3,
        title: 'Power core routine douce',
        thumbnailUrl: 'http://localhost:3000/videos/thumbnail/3',
        videoUrl: 'http://localhost:3000/videos/stream/2',
        publishedAt: '2024-07-05T10:00:00.000Z',
      },
    ];
  }

  getPathById(id: number): string | undefined {
    return this.fileMap[id];
  }

  create(createVideoDto: CreateVideoDto) {
    return 'This action adds a new video';
  }

  findAll() {
    return `This action returns all videos`;
  }

  findOne(id: number) {
    return `This action returns a #${id} video`;
  }

  update(id: number, updateVideoDto: UpdateVideoDto) {
    return `This action updates a #${id} video`;
  }

  remove(id: number) {
    return `This action removes a #${id} video`;
  }
}
