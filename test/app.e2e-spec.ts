import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app/app.module';
import { ValidationPipe } from '@nestjs/common';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    // 테스트에서도 실제 애플리케이션의 환경을 그대로 적용시켜줘야 한다.main.ts에서 적용한 pipe를 똑같이 적용시키자.
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer()).get('/').expect(200).expect('안녕');
  });
  // 1. movies 엔드포인트로 요청
  describe('/movies', () => {
    //  GET 요청을 보내고, 응답 코드가 200(리소스를 가져왔고 메시지 본문으로 전송되었다는 것을 의미)이며 응답 본문이 빈 배열인지를 확인한다.
    it('GET 영화 목록을 빈 배열로 반환해야 함', () => {
      return request(app.getHttpServer()).get('/movies').expect(200).expect([]);
    });
    // POST 요청을 보내고, send 메서드를 사용하여 req.body에 { title: 'test', year: 2000, genres: ['test'] }와 같은 데이터를 추가해서 보내서 응답 코드가 201이 되는지를 확인한다. 즉 보낸 영화 정보가 잘 생성되는지 확인한다.
    it('POST 영화를 성공적으로 생성하고 201 상태 코드를 반환해야 함', () => {
      return request(app.getHttpServer())
        .post('/movies')
        .send({ title: 'test', year: 2000, genres: ['test'] })
        .expect(201);
    });

    // 형식에 맞지않는 데이터를 보냈을 때 확인
    it('POST 유효하지 않은 데이터로 영화 생성 시 400 상태 코드를 반환해야 함0', () => {
      return request(app.getHttpServer())
        .post('/movies')
        .send({ title: 'test', year: '2000', genres: ['test'] })
        .expect(400);
    });
    it('POST 추가 필드를 포함한 영화 생성 시 400 상태 코드를 반환해야 함', () => {
      return request(app.getHttpServer())
        .post('/movies')
        .send({ title: 'Test', year: 2000, genres: ['test'], other: 'thing' })
        .expect(400);
    });
    // 필수 필드 누락 시 400
    it('POST 필수 필드 누락 시 400 상태 코드를 반환해야 함', () => {
      return request(app.getHttpServer())
        .post('/movies')
        .send({ year: 2000, genres: ['test'], other: 'thing' })
        .expect(400);
    });
    it('GET Search 해당 연도로 검색 결과가 있다면 200 상태 코드를 반환해야 함', () => {
      return request(app.getHttpServer())
        .get('/movies/search?year=2000')
        .expect(200);
    });
    it('GET Search 해당 연도로 검색 결과가 없을 시 404 상태 코드를 반환해야 함 ', () => {
      return request(app.getHttpServer())
        .get('/movies/search?year=4000')
        .expect(404);
    });
    // 2. movies:id로 요청
    describe('movies:id', () => {
      ///movies/1 엔드포인트로 GET 요청을 보내고, 응답 코드가 200인지를 확인한다.
      it('GET 200', () => {
        return request(app.getHttpServer()).get('/movies/1').expect(200);
      });
      // 해당 리소스가 없을 때 404코드인지 확인.
      it('GET 존재하지 않는 영화 ID로 조회 시 404 상태 코드를 반환해야 함', () => {
        return request(app.getHttpServer()).get('/movies/999').expect(404);
      });
    });

    it('PATCH 영화를 성공적으로 업데이트하면 200 상태 코드를 반환해야 함', () => {
      return request(app.getHttpServer())
        .patch('/movies/1')
        .send({ title: 'UpdateTest', year: 2000, genres: ['test'] })
        .expect(200);
    });

    it('PATCH 유효하지 않은 데이터로 영화 업데이트 시 400 상태 코드를 반환해야 함', () => {
      return request(app.getHttpServer())
        .patch('/movies/1')
        .send({ genres: [1, 2, 3] })
        .expect(400);
    });
    // PATCH 요청에 대한 업데이트할 값이 없는 경우
    it('PATCH 업데이트할 값이 없는 경우 404 상태 코드를 반환해야 함', () => {
      return request(app.getHttpServer())
        .patch('/movies/4')
        .send({})
        .expect(404);
    });

    it('DELETE 영화를 성공적으로 삭제하고 200 상태 코드를 반환해야 함', () => {
      return request(app.getHttpServer()).delete('/movies/1').expect(200);
    });
    // 해당리소스가 없는데 삭제하려 할 때
    it('DELETE 존재하지 않는 영화를 삭제하려고 할 때 404 상태 코드를 반환해야 함', () => {
      return request(app.getHttpServer()).delete('/movies/3').expect(404);
    });

    it('POST 잘못된 URL로 영화를 생성하려고 할 때 404 상태 코드를 반환해야 함', () => {
      return request(app.getHttpServer())
        .post('/movies/2')
        .send({ title: 'test', year: 2000, genres: ['test'] })
        .expect(404);
    });
  });
});
// 200는 요청이 성공했음을 나타내는 성공 응답 상태 코드이다.
// 400은 형식에 맞지 않을때
// 404는 해당리소스가 없을때
