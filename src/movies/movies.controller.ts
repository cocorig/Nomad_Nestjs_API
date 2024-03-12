import {
  Controller,
  Get,
  Param,
  Post,
  Delete,
  Patch,
  Body,
  Query,
  ParseIntPipe,
} from '@nestjs/common';

import { MoviesService } from './movies.service';
import { Movie } from './entities/movie.entity';
import { CreateMovieDto } from './dto/create-movie-dto';
import { UpdateMovieDto } from './dto/update-movie-dto';
// movies
@Controller('movies') // 기본 엔드포인터
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {} // Provider을 컨트롤러 클래스에 주입

  // 전체 영화 배열 가져오기
  @Get()
  getAll(): Movie[] {
    return this.moviesService.getAll();
  }

  // 영화 검색하기
  @Get('search')
  search(@Query('year', ParseIntPipe) searchingYear: number) {
    return this.moviesService.search(searchingYear);
  }

  // 특정 영화 가져오기, movieId이게 number로 타입을 명시했지만 실제로 바든 값은 문자열 이기 때문에 이 값이 올바른 타입인지 알 수 없음, 그래서 ParseIntPipe를 사용해 매개변수를 명시적으로 숫자로 변환할 수 있다.
  //https://docs.nestjs.com/pipes
  @Get(':id') // 착각하지말자, 명시적으로 지정한거지, 타입이 number로 변하는 것이 아니다. ParseIntPipes는 메소드 핸들러 매개변수가 JavaScript 정수로 변환되도록 보장하는(또는 변환이 실패할 경우 예외를 발생시키는) 변환해준다.
  getOne(@Param('id') movieId: number): Movie {
    return this.moviesService.getOne(movieId);
  }
  // 영화 추가하기
  @Post()
  create(@Body() movieData: CreateMovieDto) {
    return this.moviesService.create(movieData);
  }
  // 앞에 '/'안써줘도 '/:id' 이렇게 처리된다.
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) movieId: number) {
    return this.moviesService.deleteOne(movieId);
  }
  //req.body를 얻기 위해 @Body로 요청을 보낸다.
  @Patch(':id')
  patch(
    @Param('id', ParseIntPipe) movieId: number,
    @Body() updateData: UpdateMovieDto,
  ) {
    return this.moviesService.update(movieId, updateData);
  }

  /* Patch에서 리턴된 값
  {
  "updateMovie": "12",
  "name": "파묘", -> 내가 보낸 body 객체를 풀어서 반환
  "director": "장재현"
  }
  */
}
// express에서 body를 json으로 리턴하게 하려면 설정을 해야 했었는데, nest.js에선 기본적으로 제공을 해주기 때문에 설정없이 json으로 변환된다.
// Put은 모든 리소스를 업데이크, Patch는 리소스의 일부분만 업데이트
//  nestjs가  id다음에 search를 작성하면 search를 id로 착각하기 때문에  search를 위에 작성해야 한다.

// @Query는 Query Parameter(예. movies/search?year=2000)를 받아올 때 사용한다.
// (예. movies/search?year=2000), "?" 뒤에 변수의 값을 받는다.
// @Param은 요청 주소에 포함되어 있는 값을 받는다.
// (예. /movies/333)
// 어떤 리소스를 식별하고 싶다면 @Param, 정렬이나 필터링을 한다면 @Query

/* NestJS와 ExpressJS 차이

// NestJS
@Body(param?: string)

// ExpressJS
req.body / req.body[param]

// NestJS
@Query(param?: string)

// ExpressJS
req.query / req.query[param]

*/
