import { Test, TestingModule } from '@nestjs/testing';
import { MoviesService } from './movies.service';
import { NotFoundException } from '@nestjs/common';
// 정상적으로 호출되고,정상적으로 예외 처리를 하는지 테스트
describe('MoviesService', () => {
  let service: MoviesService;

  // 테스트하기 전에 실행
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MoviesService],
    }).compile();

    service = module.get<MoviesService>(MoviesService);
    // 테스트를 위해 가짜 데이터 생성
    service.create({
      title: 'Test Movie1',
      genres: ['Movie'],
      year: 2000,
    });
    service.create({
      title: 'Test Movie2',
      genres: ['Movie'],
      year: 2001,
    });
    service.create({
      title: 'Test Movie3',
      genres: ['Movie'],
      year: 2001,
    });
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
        title: 'Test Movie4',
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
        // movie 추가
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
  // 검색 테스트
  describe('search', () => {
    // 같은 year가 존재하는 경우 해당 영화 배열을 반환하는지 확인
    it('should return an array of movies for a valid year', () => {
      const year = 2000;
      const result = service.search(year);
      expect(result).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            title: 'Test Movie1',
            genres: ['Movie'],
            year: 2000,
          }),
        ]),
      );
    });
    // 해당 영화가 없는 경우 에러 처리
    it('should throw NotFoundException for a year with no movies', () => {
      const year = 1999;
      expect(() => {
        service.search(year);
      }).toThrow(NotFoundException);
    });
    // 유효하지 않는 값이 주어진 경우 에러 처리
    it('should throw NotFoundException for an invalid year', () => {
      const year = -1;
      expect(() => {
        service.search(year);
      }).toThrow(NotFoundException);
    });
    // Movies배열이 비어 있는 경우 검색을 하는 경우 에러 처리
    it('should throw NotFoundException if movies array is empty', () => {
      Reflect.set(service, 'movies', []);
      const year = 2000;
      expect(() => {
        service.search(year);
      }).toThrow(NotFoundException);
    });
  });
});

/*
- describe(): 여러개의 it()을 하나의 Test 작업단위로 묶어주는 API이다.,하나의 작은 TestCase를 it()라고 한다면 describe()는 여러개의 TestCase를 하나의 그룹으로 묶어주는 역할을 한다.

- beforeEach() :  TestCase의 각 코드가 실행되기 전에 수행되어야 하는 로직을 넣는 API이다. ,반복되는 Logic을 넣을 때 사용된다.

- expect(): 테스트에서 예상되는 결과를 지정해 테스트를 수행한다.

- toEqual(): 두 값이 서로 동일한지 확인한다.
- toBeDefined():null과 undefined를 제외한 모든 값에 대해 true를 반환하고,값이 정의되었는지 확인한다.
- toBeInstanceOf():값이 특정 클래스의 인스턴스인지 확인한다.
- toBeGreaterThan(): 값이 주어진 다른 값보다 큰지 확인한다. 주어진 값이 다른 값보다 크면 true,작으면 false반환
- arrayContaining(): 배열의 요소가 포함하는지 확인.
- objectContaining():  프로퍼티가 포함되어 있는지를 확인.
 // 예외 처리 하는 방법 ?? toThrow , try-catch문 무슨 차이지
*/
