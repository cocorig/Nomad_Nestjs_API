import { Module } from '@nestjs/common';
import { MoviesModule } from '../movies/movies.module';
import { AppController } from './app.controller';

// 데코레이터는 클래스에 함수기능을 추가할 수 있다.
@Module({
  imports: [MoviesModule], // 하나의 모듈은 하나의 controllers와 providers를 가져야 하기 때문에 분리
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
