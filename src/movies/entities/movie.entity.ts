// Movie클래스(인터페이스)를 서비스로 보내기위해 export.
// 여기선 가짜 데이터베이스로 실습이기 때문에 객체로 쓰지만,실제론 entities에 데이터베이스의 모델을 만들어야 한다.
// https://docs.nestjs.com/techniques/database
//
export class Movie {
  id: number;
  title: string;
  year: number;
  genres: string[];
}
/* 실제 데이터베이스 연동할 때 이렇게 생김
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ default: true })
  isActive: boolean;
}
*/
