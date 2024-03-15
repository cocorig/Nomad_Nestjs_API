import { Injectable } from '@nestjs/common';
import { Movie } from './entities/movie.entity';
import { NotFoundException } from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie-dto';
import { UpdateMovieDto } from './dto/update-movie-dto';
// Providers can be injected into other classes via 'constructor parameter injection using Nest's built-in Dependency Injection (DI) system.'
//https://docs.nestjs.com/providers#dependency-injection
@Injectable()
export class MoviesService {
  private movies: Movie[] = [];

  getAll(): Movie[] {
    return this.movies;
  }

  getOne(id: number): Movie {
    const movie = this.movies.find((movie) => movie.id === id);
    //반환되는 값이 없으면 undefined 출력
    if (!movie) {
      // NotFoundException :오류 처리 NestJS 프레임워크에서 제공하는 예외 클래스 중 하나,리소스를 찾을 수 없을 때(알 수 없는 요청이 왔을 때) 클라이언트에게 알리기 위해 사용한다.
      throw new NotFoundException(
        `Movie ID가 ${id}인 영화를 찾을 수 없습니다.`,
      );
    }

    return movie;
  }

  search(year: number): Movie[] {
    const moviesForYear: Movie[] = this.movies.filter(
      (movie) => movie.year === year,
    );
    if (!moviesForYear.length) {
      throw new NotFoundException(
        `${year}년에 해당하는 영화를 찾을 수 없습니다.`,
      );
    }

    return moviesForYear;
  }
  create(movieData: CreateMovieDto) {
    this.movies.push({
      id: this.movies.length + 1,
      ...movieData,
    });
  }

  deleteOne(id: number) {
    // const movieId = this.movies.find((movie) => movie.id === id); // 먼저 param의 id가 movies배열안에 id가 있는지 확인 -> 없으면 올바르지 않은 값이기 때문에 NotFoundException로 예외처리
    // if (!movieId) {
    //   throw new NotFoundException(`Movie with ID ${id} not found`);
    // }  ->  이 코드가 getOne메서드 코드와 똑같으니까 이렇게 변경
    const movieOne = this.getOne(id); // 삭제하고자 하는 영화 반환
    this.movies = this.movies.filter((movie) => movie.id !== movieOne.id);
    return this.movies;
  }
  update(movieId: number, updateData: UpdateMovieDto) {
    const movie = this.getOne(movieId);
    this.deleteOne(movieId);
    this.movies.push({ ...movie, ...updateData });
  }
}
