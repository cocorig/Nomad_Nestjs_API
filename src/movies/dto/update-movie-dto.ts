import { PartialType } from '@nestjs/mapped-types';
import { CreateMovieDto } from './create-movie-dto';

// export class UpdateMovieDto {
//   @IsString()
//   readonly title?: string;

//   @IsNumber()
//   readonly year?: number;

//   @IsArray()
//   @IsString({ each: true })
//   readonly genres?: string[];
// }

// npm i @nestjs/mapped-types
export class UpdateMovieDto extends PartialType(CreateMovieDto) {}
// CreateMovieDto그대로 옵셔널로 바꿔주는 유틸리티 기능을 제공
// https://docs.nestjs.com/openapi/mapped-types
