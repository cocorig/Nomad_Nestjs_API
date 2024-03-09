import {
  Controller,
  Get,
  Param,
  Post,
  Delete,
  Patch,
  Body,
  Query,
} from '@nestjs/common';

// movies
@Controller('movies') // 기본 엔드포인터
export class MoviesController {
  @Get()
  getAll() {
    return '모든 영화를 보여줘!';
  }
  // movies/search?year=2000
  @Get('search')
  search(@Query('year') searchingYear: string) {
    return `${searchingYear} 영화 검색 중..`;
  }

  // @Param를 사용하면 url에 있는 id 파라이터를 반환해 준다.여기서 @Get안에 path이름과  @Param안에 property 이름이 같아야 한다.
  @Get('/:id')
  getOne(@Param('id') movieId: string) {
    return `영화 id :${movieId} `;
  }

  @Post()
  create(@Body() movieData) {
    // @Body는  movieData안에 request의 body를 가져온다.(우리가 json형식으로 보내는 값 )
    return movieData;
  }
  @Delete('/:id')
  remove(@Param('id') movieId: string) {
    return `${movieId}번 영화 삭제`;
  }
  @Patch('/:id')
  patch(@Param('id') movieId: string, @Body() updateData) {
    return {
      updateMovie: movieId, // 업데이트 할 movie id와 우리가 보낼 데이터 객체를 리턴
      ...updateData,
    };
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
// 참고자료
//https://ryan-han.com/post/translated/pathvariable_queryparam/

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
