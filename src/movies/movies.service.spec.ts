import { Test, TestingModule } from '@nestjs/testing';
import { MoviesService } from './movies.service';
import { NotFoundException } from '@nestjs/common';

describe('MoviesService', () => {
  let service: MoviesService;

  beforeEach(async () => {
    // 테스트하기 전에 실행
    const module: TestingModule = await Test.createTestingModule({
      providers: [MoviesService],
    }).compile();

    service = module.get<MoviesService>(MoviesService);
  });
  // 테스트하는 부분
  it('should be defined', () => {
    // it(individual test)개별 테스트
    expect(service).toBeDefined();
  });
  // getAll()이 배열을 리턴하는지 안하는 지 테스트
  describe('getAll', () => {
    it('should return an array', () => {
      const result = service.getAll(); //  MoviesService의 getAll()의 결과가 배열 인스턴스인지 테스트
      expect(result).toBeInstanceOf(Array);
    });
  });

  // getOne 메서드가 올바른 영화 객체를 반환하는지 확인하는 테스트
  describe('getOne', () => {
    it('should return an movie', () => {
      service.create({
        // 테스트를 위해 가짜 데이터 생성
        title: 'Test Movie',
        genres: ['Movie'],
        year: 2000,
      });
      const movie = service.getOne(1);
      expect(movie).toBeDefined(); // movie객체가 정의되어 있는지 확인
      expect(movie.id).toEqual(1);
    });

    it('should throw a NotFoundException', () => {
      try {
        service.getOne(999);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
      }
    });
  });
  describe('deleteOne', () => {
    it('deletes a movie', () => {
      service.create({
        // movie 생성
        title: 'Test Movie',
        genres: ['Movie'],
        year: 2000,
      });
      const beforeDeletes = service.getAll().length; // 모든 movie를 가져와 length값을 저장
      service.deleteOne(1); // movie 지움
      const afterDelete = service.getAll().length; // 지운 후 movie 길이의 값을 가져와 movie가 얼마나 남았는지 확인
      // 잘 삭제되었으면 afterDelete < beforeDeletes 성립
      expect(afterDelete).toBeLessThan(beforeDeletes);
    });

    it('should return a 404', () => {
      try {
        service.getOne(999);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
      }
    });
  });
  describe('create', () => {
    it('should create a movie', () => {
      const beforeCreate = service.getAll().length;
      service.create({
        // movie 생성
        title: 'Test Movie',
        genres: ['Movie'],
        year: 2000,
      });
      const afterCreate = service.getAll().length;
      console.log(beforeCreate, afterCreate);
      expect(afterCreate).toBeGreaterThan(beforeCreate);
    });
  });

  describe('update', () => {
    it('should update a movie', () => {
      service.create({
        // movie 생성
        title: 'Test Movie',
        genres: ['Movie'],
        year: 2000,
      });
      service.update(1, { title: 'Updated Movie' });
      const movie = service.getOne(1);
      expect(movie.title).toEqual('Updated Movie');
    });
    it('should throw a NotFoundException', () => {
      try {
        service.update(999, {});
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
      }
    });
  });
});
