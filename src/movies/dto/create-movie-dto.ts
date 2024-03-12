import { IsString, IsNumber, IsArray } from 'class-validator';

export class CreateMovieDto {
  @IsString()
  readonly title: string;

  @IsNumber()
  readonly year: number;

  @IsArray() // 필드가 배열임을 검사
  @IsString({ each: true }) //배열의 각 요소가 문자열임을 검사,검증 옵션들은 ValidationOptions.d.ts파일에 자세히 나와있음
  readonly genres: string[];
}
