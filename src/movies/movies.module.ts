import { Module } from '@nestjs/common';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';
@Module({
  controllers: [MoviesController],
  providers: [MoviesService],
})
export class MoviesModule {}
// 여기서 시작, NestJS가 MoviesService를 import하고, controller에 inject(주입)한다.
// dependency injection
