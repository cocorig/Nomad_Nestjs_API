# NestJS

## 목차

- Nest.js 소개

  - [Nest.js란 무엇인가](#nestjs란-무엇인가)
  - [설치/실행](#설치실행)
  - [기본 폴더 구조](#기본-폴더구조)
  - [Nest.js CLI](#nestjs-cli)

- 기본 개념과 데코레이터

  - [@Controller](#controller)
  - [@Query, @Param, @Body](#query-param-body)
  - [@Get, @Post, @Delete, @Patch](#get-post-delete-patch)
  - [Services 만들기](#services-만들기)
  - [NotFoundException](#notfoundexception)

- 유효성 검사와 DTO

  - [ValidationPipe](#validationpipe)
  - [내장된 ValidationPipe 사용](#내장된-validationpipe-사용)
  - [DTO](#dto)

- 테스트
  - [Testing](#testing)
  - [HTTP 상태 코드](https://developer.mozilla.org/ko/docs/Web/HTTP/Status)
  - [HTTP 상태 코드](#http-상태-코드)
  - [API 설계](#api-설계)

## Reference

해당 강의와 참고 자료를 바탕으로 정리한 내용입니다.

- [노마드님의 NestJS 강의](https://nomadcoders.co/nestjs-fundamentals)
- [NestJS 공식문서](https://docs.nestjs.com/)
- [이랜서.BLOG](https://www.elancer.co.kr/blog/view?seq=197)
- [Path Variable과 Query Parameter는 언제 사용해야 할까?](https://ryan-han.com/post/translated/pathvariable_queryparam/)
- [SRP(Single Responsibility Principle)이란?](https://nesoy.github.io/articles/2017-12/SRP)
- [exception-filters 공식문서](https://docs.nestjs.com/exception-filters)
- [내장 파이프 공식문서](https://docs.nestjs.com/pipes)
- [Validation 공식문서](https://docs.nestjs.com/techniques/validation)
- [class-validator 예제 깃헙](https://github.com/typestack/class-validator)
- [Testing](https://docs.nestjs.com/fundamentals/testing)

# Nest.js란 무엇인가

Node.js는 많은 사람들이 사용하는 서버 프레임워크이다. 지금도 가장 높은 정유율을 보유하고 있다. 하지만 Node.js는 정해진 아키텍처가 없기 때문에 개발자마다 다른 구조로 작성하는 문제가 있어, 협업이나 유지 보수에 어려움 있었다. 이러한 부분을 보완하기 위해 나온 것이 `NestJS`이다.
`NestJS` 는 Node.js의 Express 위에서 구축된 프레임워크로, Express의 기능을 확장하여 보다 체계적이고 모듈화된 구조를 제공한다.또한 TypeScript를 지원하며, 순수 JavaScript로도 사용 가능하다. 정의된 아키텍처에 따라 개발해야 하며, 이렇게 개발된 프로젝트는 여러 개발자 간 협업하기 좋다. 이로 인해 대규모 프로젝트에서 많이 사용된다. 또한, 라이브러리 및 기능들이 기본적으로 포함되어 있다. (RESTful API 구축을 위한 HTTP 연결, DB 연동, 미들웨어 구축, 인증 및 보안)
이 때문에 간단한 작은 규모의 서버일 땐 성능 오버헤드가 발생할 수 있기 때문에 프로젝트 특성을 파악해 가면서 적용하는 게 중요하다.

 <br>

# 설치/실행

## Nest.js CLI

> Nest CLI란?
> Nest 애플리케이션의 초기화, 개발 및 유지 관리를 도와주는 인터페이스 도구이다.

```bash
npm i -g @nestjs/cli
```

## 프로젝트 생성

```bash
nest new project-name
```

## 실행

- 개발 환경에서 실행

```bash
 npm run start
```

또는

- 파일 변경을 감지, 파일을 감시하여 자동으로 서버를 다시 컴파일하고 다시 로드한다. (nodemon 제공)

```bash
npm run start:dev
```

- 저장소가 모노레포 인 경우 swc-loader 패키지 사용 [모노레포 swc-loader](https://docs.nestjs.com/recipes/swc)

```bash
npm i --save-dev @swc/cli @swc/core nest start -b swc
```

 <br>

# 기본 폴더구조

 <br>

<img width="300" alt="스크린샷 2024-03-08 오후 3 51 09" src="https://github.com/cocorig/Nomad_Nestjs_API/assets/95855640/22fd09a7-6fc9-4209-b5fc-6dfdc431fcd7">

```
src/
├── app.controller.spec.ts
├── app.controller.ts
├── app.module.ts
├── app.service.ts
└── main.ts
```

 <br>

먼저 젤 상단에 있는 파일부터 살펴보자.

## app.controller.spec.ts

- 특정 컨트롤러의 테스트를 위한 파일이다. Jest 또는 다른 테스트 프레임워크를 사용하여 컨트롤러의 동작을 확인할 수 있다.

## main.ts (진입점)

```ts
import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
```

위 코드를 보면 app.module 파일에서 불러온 `AppModule`을 생성하고, 3000번 포트에서 서버를 실행하는 bootstrap() 함수를 호출하고 있다.
`AppModule`은 한 가지 역할을 담당하는 루트 모듈로써, 어플리케이션과 같은 역할을 한다고 볼 수 있다.

## app.modules.ts (controller, service 포함, 앱의 루트 모듈)

```ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// 데코레이터는 클래스에 함수기능을 추가할 수 있다.
@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

위 코드에서는 `AppModule` 클래스가 정의되어 있고, `@Module` 데코레이터를 사용해 모듈을 정의하고 있다.
이 `@Module` 데코레이터는 controllers와 providers 속성이 포함하고 있다. controllers 속성은 컨트롤러 클래스들을 배열로 포함시키고, providers 속성은 서비스 클래스 배열을 포함한다.

그럼 이 데코레이터 안에 있는 속성들을 하나씩 살펴보자.

## app.controller.ts (url을 받아 함수를 리턴)

app.controller.ts로 이동하면 다음과 같은 코드를 볼 수 있다.

```ts
import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get() // express의 get라우터
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/hello')
  sayHi(): string {
    return this.appService.getHi();
  }
}
```

컨트롤러는 express의 라우터와 같은 존재이다. 실제로 HTTP 요청을 처리하는 컨트롤러 클래스를 정의하고, 라우팅을 처리해 요청에 따라 적절한 응답을 반환하는 역할을 한다.기본적으로 url 엔드포인터를 가져오고 url에 매핑된 함수를 실행한다.(엔드포인터 처리 역할)
위 코드를 보면 `@Controller` 안에 `@Get` 데코레이터가 사용되어 있는데 이건 express의 app.get 메서드와 같은 역할이라고 볼 수 있다.
즉 `@Get` 데코레이터는 특정 url 경로로 들어오는 GET요청을 처리하고,이에 해당하는 함수를 실행하는 것이다. 예를 들어, `/hello` url을 요청받으면 sayHi 함수가 호출되고, 이 sayHi 함수는 `appService.getHi()`를 실행한다. 근데 여기서 함수를 실행하는 게 아니라 `appService`에 있는 함수를 실행하고 있다.

정리해보면 NestJS 에서는 컨트롤러는 url라우팅 및 요청을 받아 해당 로직을 수행하도록 서비스에 요청하고, 이 서비스는 실제 비지니스 로직을 실행해 그 결과를 다시 컨트롤러에게 반환한다. 이렇게 실행과 비지니스 로직을 분리하기 위해 서비스와 컨트롤러를 구분하여 사용한다.

> 비지니스 로직을 예를 들면 사용자가 회원가입을 요청하면, 사용자가 입력한 정보를 검증하고 데이터베이스에 저장하는 과정이 비지니스 로직에 해당한다.

### 주의할 점

```ts

  @Get()
  // 이렇게 데코레이터와 함수 사이에 빈칸을 추가하면 동작하지 않는다.
  getHello(): string {
    return this.appService.getHello();
  }
```

## app.service.ts (실제 비지니스 로직 실행)

```ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string { /
    return 'Hello World!';// 실제 함수 로직 -> 함수를 실행하는 컨트롤러에게 전달
  }
  getHi(): string {
    return 'Hi!';
  }
}
```

위의 코드에서 `@Injectable` 데코레이터 함수는 `AppService` 클래스가 NestJS 에서 의존성 주입이 가능한 서비스임을 나타낸다. getHello()는 실제로 실행되는 함수로, 리턴 값인 Hello World!는 클라이언트에게 반환되어 브라우저에 출력된다.
즉, 비즈니스 로직이나 데이터 처리를 담당하는 서비스 클래스를 정의하고, 컨트롤러와 서비스를 분리함으로써 코드를 재사용할 수 있게된다.

# Nest.js CLI

다음과 같이 터미널에서 nest를 실행하면 주요 명령어와 옵션을 확인할 수 있다.

```bash
nest
```

<img width="558" alt="스크린샷 2024-03-09 오후 10 33 37" src="https://github.com/cocorig/Nomad_Nestjs_API/assets/95855640/5c8ac8cc-172d-4625-9dd0-4ce65405aebc">

- 새로운 Nest 요소를 생성할 때 사용하는 명령어

```bash
nest generate|g [options] <schematic> [name] [path]
```

- schematic : 생성할 요소의 유형을 나타낸다. (module, controller, service 등)
- name : 생성할 요소의 이름을 나타낸다.
- path : 생성된 요소의 경로를 나타낸다. (기본적으로 현재 디렉토리에 생성)

<br>

### 예시

1. controller 생성

```bash
nest generate controller movies
```

- 아래와 같이 간단하게 줄여서 사용할 수도 있다.

```bash
nest g co movies
```

- What name would you like to use for the controller?
  컨트롤러를 생성할 때 이름을 지정하지 않으면 다시 이름을 입력하라는 메시지가 표시된다.
  이때 이름을 입력하지 않고 엔터를 누르면 컨트롤러가 폴더 없이 생성된다.

예를 들어, movies라는 이름의 컨트롤러를 생성하면 다음과 같이 movies 폴더 안에 컨트롤러 파일이 생성되고, app.module.ts 파일에 자동으로 MoviesController가 추가된다.

<img width="340" alt="스크린샷 2024-03-09 오후 10 52 16" src="https://github.com/cocorig/Nomad_Nestjs_API/assets/95855640/ce073e1d-c0e7-492e-a57d-04c44fb13847">

<br>
movies.controller.ts 파일로 이동 후 api route 작업을 해주자!

---

<br>

# @Controller

```ts

(alias) Controller(prefix: string | string[]): ClassDecorator (+2 overloads)
import Controller
```

- `@Controller`는 경로(prefix)를 받아서 해당 경로에 대한 요청을 처리할 수 있는 컨트롤러를 정의하는 데 사용한다.이 prefix의 값은 해당 컨트롤러에 대한 모든 라우트의 경로에 적용되므로 기본 경로라고 볼 수 있다. 따라서 위의 코드에서 기본 경로가 `/movie` 임을 나타낸다.
  `MoviesController`클래스는 @Controller 사용했기 때문에 해당 클래스는 주어진 경로에 해당하는 메서드(예제 코드에선 getAll,getOne,search)를 HTTP응답을 생성할 수 있다.

# @Query, @Param, @Body

## @Query

```ts
(alias) Query(property: string, ...pipes: (PipeTransform<any, any> | Type<PipeTransform<any, any>>)[]): ParameterDecorator (+2 overloads)
import Query
```

- `@Query`는 HTTP 요청의 쿼리 파라미터에서 값을 추출하고 해당 값을 반환한다.
  @Query의 매개변수인 `property`는 추출하고자 하는 쿼리의 이름을 나타낸다. 즉, HTTP 요청에서 해당 이름과 일치하는 쿼리 파라미터를 찾아 값을 추출한다.
  예를 들어, 예제 코드에서 year를 지정하면 HTTP 요청에서 `?year=2000`과 같은 형식의 쿼리 값을 추출한다. 이 추출된 값에 대해 결과를 반환하거나 변환 또는 유효성 검사를 실행하는 데 사용하는 것이 두 번째 매개변수인 `pipes`이다.

## @Param

```ts
(alias) Param(property: string, ...pipes: (PipeTransform<any, any> | Type<PipeTransform<any, any>>)[]): ParameterDecorator (+2 overloads)
import Param
```

- ` @Param`는 첫 번째 매개변수인 경로 매개변수의 이름을 나타내고,`property`값에 해당하는 값을 반환한다.이 반환 값을 두 번째 매개변수 `pipes`에 할당하는 것이다.

### @Query와 @Param의 차이 점

`@Query`는 쿼리 `파라미터의 값`을 받아올 때 사용한다.
(예. movies/search?year=2000), `"?" 뒤`에 변수의 값을 받는다. 정렬이나 필터링을 할 때 주로 사용되고,
`@Param`은 요청 `주소에 포함되어 있는 값`을 받는다.
(예. /movies/333)
즉, 어떤 리소스를 식별하고 싶을 때 사용된다.

## @Body

```ts
(alias) Body(): ParameterDecorator (+2 overloads)
import Body
```

- `@Body`는 HTTP POST req의 body에서 데이터를 추출하여 movieData 매개변수에 할당한다.

<br>

# @Get, @Post, @Delete, @Patch

## @Post

```ts
 @Post()
  create(@Body() movieData) {
    // @Body는  movieData안에 request의 body를 가져온다.(우리가 json형식으로 보내는 값 )
    return movieData;
  }

```

```ts
(alias) Post(path?: string | string[]): MethodDecorator
import Post

```

- `@Post`안에 경로(path)를 지정하지 않았으면 메서드가 속한 컨트롤러의 기본 경로로 사용되고,이 경로로 POST 요청을 보낸다.

## @Delete

```ts
 @Delete('/:id')
  remove(@Param('id') movieId: string) {
    return `${movieId}번 영화 삭제`;
  }
```

- `@Delete`는 주어진 쿼리 파라미터의 값에 때라 삭제된다.

## @Patch

```ts
@Patch(' /:id')
  patch(@Param('id') movieId: string, @Body() updateData) {
    return {
      updateMovie: movieId, // 업데이트 할 movie id와 우리가 보낼 데이터 객체를 리턴
      ...updateData,
    };
  }

  /* Patch에서 리턴된 값
  {
  "updateMovie": "12",
  "name": "파묘",
  "director": "장재현"
  }
  */
```

- 위의 예제에서 `@Patch('/:id')`는 주어진 id에 해당하는 영화를 찾아서, `movieId`에 할당하고, 해당 영화의 정보를 업데이트하기 위해 req의 body에서 데이터를 추출한다.
  이 데이터를 `updateData`에 할당한다. 업데이트된 영화의 id와 함께 업데이트된 데이터를 반환하게 된다.

<br>

# Services 만들기

이번에도 터미널 창에 다음 명령어로 app.service.ts 파일을 생성하자.

```bash
 nest g s movies
```

app.module.ts를 보면 자동으로 providers에 Service가 생겼다!
앞에서 알았듯이 Service는 비지니스 로직을 처리한다. 따라서 데이터 베이스 작업도 이 파일에서 한다는 것~

> SRP(Single Responsibility Principle)
> 하나의 module, class 혹은 function이 하나의 동작만의 책임을 갖는다는 원칙이다.

- [Path Variable과 Query Parameter는 언제 사용해야 할까?](https://ryan-han.com/post/translated/pathvariable_queryparam/)
- [SRP(Single Responsibility Principle)이란?](https://nesoy.github.io/articles/2017-12/SRP)

<br>

# NotFoundException

NestJS 프레임워크에서 제공하는 예외 클래스 중 하나,리소스를 찾을 수 없을 때(알 수 없는 요청이 왔을 때) 클라이언트에게 알리기 위해 사용한다.

[exception-filters 공식문서](https://docs.nestjs.com/exception-filters)

# 유효성 검사와 DTO

# ValidationPipe

> `To automatically validate incoming requests, Nest provides several pipes available right out-of-the-box`

- 자동으로 요청을 검증하기 위해 사용 가능한 여러 파이프를 제공한다.
- NestJs에선 전송된 모든 데이터를 자동으로 검증하기 위한 여러 pipes가 존재한다.

  - ValidationPipe
  - ParseIntPipe
  - ParseBoolPipe
  - ParseArrayPipe
  - ParseUUIDPipe

이 중 `ValidationPipe`는 모든 클라이언트 페이로드에 대해 유효성 검사를 하고, class/DTO에 선언해 사용한다.

# 내장된 ValidationPipe 사용

내장된 ValidationPipe를 사용하기 위해 먼저 필요한 종속성을 설치하자.

```bash
npm i --save class-validator class-transformer
```

- ValidationPipe 옵션

  - whitelist : DTO에 정의되지 않은 속성은 무시된다.
  - forbidNonWhitelisted : DTO에 정의되지 않은 속성이 있으면 요청이 거부된다.

    -> 즉 요청이 오면, DTO 클래스에 정의된 속성만 허용되며, 정의되지 않은 속성이나 타입이 잘못된 속성이 있으면 요청이 거부할 수 있다. (요청 자체를 막음)

  - transform : 우리가 원하는 타입으로 자동으로 변환해주는 옵션이다.

- [내장 파이프 공식문서](https://docs.nestjs.com/pipes)
- [Validation 공식문서](https://docs.nestjs.com/techniques/validation)

<br>

# DTO

- DTO (Data Transfer Object)클래스는 데이터 전송을 위한 객체로, 주로 `컨트롤러와 서비스 간에 데이터를 주고받을 때` DTO를 사용한다.(ex. req.body의 타입을 지정)
  class-validator 라이브러리에 많은 옵션이 있는데 [class-validator 예제 깃헙](https://github.com/typestack/class-validator) 여기 잘 정리되어 있다.

```ts
import { IsString, IsNumber, IsArray } from 'class-validator';

export class CreateMovieDto {
  @IsString()
  readonly title: string;

  @IsNumber()
  readonly year: number;

  @IsArray() // 필드가 배열임을 검사
  @IsString({ each: true }) // 배열의 각 요소가 문자열임을 검사,검증 옵션들은 ValidationOptions.d.ts파일에 자세히 나와있음
  readonly genres: string[];
}
```

`@IsString()` 데코레이터는 `title` 필드가 문자열인지 확인하고, `@IsNumber()` 데코레이터는 `year` 필드가 숫자인지 확인한다.`@IsArray()` 데코레이터는 `genres` 필드가 배열인지 확인하고, `@IsString({ each: true })` 데코레이터는 genres 배열의 각 요소가 문자열인지 확인한다.

다음 동일한 구조에서 모든 필드가 선택적으로 처리되도록 처리하려면? `@nestjs/mapped-types` 라이브러리의 `PartialType`을 사용할 수 있다.

- 설치

```bash
 npm i @nestjs/mapped-types
```

- 예제

```ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateMovieDto } from './create-movie-dto';

export class UpdateMovieDto extends PartialType(CreateMovieDto) {}
// CreateMovieDto 그대로 옵셔널로 바꿔주는 유틸리티 기능을 제공
// https://docs.nestjs.com/openapi/mapped-types
```

# Testing

- 설치

```bash
npm i --save-dev @nestjs/testing

```

movies.controller.ts라는 파일을 테스팅하고 싶다면 app.controller.spec.ts파일이 있어야 하는 것처럼 NestJs에서는 기본 규칙이다. 또한 jest는 보통 .spec.ts로 끝나는 파일들을 테스트 대상으로 인식하고 실행 수 있도록 설정되어 있다. <br>
따라서 새로운 테스트 파일을 추가하면 Jest가 자동으로 해당 파일을 찾아 실행한다.

```json
  "test": "jest",
    "test:watch": "jest --watch",
    "test:cov": "jest --coverage",
    "test:debug": "node --inspect-brk -r tsconfig-paths/register -r ts-node/register node_modules/.bin/jest --runInBand",
    "test:e2e": "jest --config ./test/jest-e2e.json"
```

- `test:watch`:파일이 변경될 때마다 자동으로 테스트를 다시 실행한다.
- `test:cov` : jest가 프로젝트의 코드 커버리지를 계산하고 보고서를 생성한다.이를 통해 어떤 부분이 테스트되지 않았는지를 파악할 수 있다.
- `test:debug` : Jest를 디버깅 모드로 테스트
- `test:e2e` : 전체 시스템을 테스트하는 것으로, 주로 페이지로 가면 특정 페이지가 나와야하는 경우 사용(사용자가 취할만한 액션들을 처음부터 끝까지 테스트)

## Unit Testing

function 같은 하나의 유닛만을 테스트할 때 사용한다.또한, 코드의 각 부분이 예상대로 작동하는지 확인한다. <br>
유닛 테스팅을 사용해서 MoviesService를 테스트해보자.

- Jest에서 제공하는 각 훅

  - beforeEach(fn, timeout): 각각의 테스트 케이스가 실행되기 전에 실행한다.(데이터베이스 연결을 설정,테스트에 필요한 작업)
  - beforeAll(fn, timeout) : 모든 테스트 케이스가 실행되기 전에 한 번 실행한다.(테스트 환경의 전체 설정을 초기화)
  - afterEach(fn, timeout) : 각각의 테스트 케이스가 실행된 후에 실행한다. (clean-up 작업,, 데이터베이스 연결을 종료)
  - afterAll(fn, timeout) : 모든 테스트 케이스가 실행된 후에 한 번 실행한다.

- describe(): 여러개의 it()을 하나의 Test 작업단위로 묶어주는 API이다.,하나의 작은 TestCase를 it()라고 한다면 describe()는 여러개의 TestCase를 하나의 그룹으로 묶어주는 역할을 한다.

- beforeEach() : TestCase의 각 코드가 실행되기 전에 수행되어야 하는 로직을 넣는 API이다.반복되는 Logic을 넣을 때 사용된다.(테스트에 필요한 객체를 생성)

```ts
// 테스트하기 전에 실행
beforeEach(async () => {
  const module: TestingModule = await Test.createTestingModule({
    providers: [MoviesService],
  }).compile();

  service = module.get<MoviesService>(MoviesService);
});
```

- expect(): 테스트에서 예상되는 결과를 지정해 테스트를 수행한다.

```ts
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
      expect(movie).toBeDefined(); // getOne 메서드가 유효한 값을 반환했는지를 검증
      expect(movie.id).toEqual(1);
    });
```

- toEqual(): 두 값이 서로 동일한지 확인한다.
- toBeDefined():null과 undefined를 제외한 모든 값에 대해 true를 반환하고,값이 정의되었는지 확인한다.
- toBeInstanceOf():값이 특정 클래스의 인스턴스인지 확인한다.

```ts
describe('getAll', () => {
  it('should return an array', () => {
    const result = service.getAll(); //  MoviesService의 getAll()의 결과가 배열 인스턴스인지 테스트
    expect(result).toBeInstanceOf(Array);
  });
});
```

```ts
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
```

- toBeGreaterThan(): 값이 주어진 다른 값보다 큰지 확인한다. 주어진 값이 다른 값보다 크면 true,작으면 false반환

- toBeLessThan();값이 주어진 다른 값보다 작은지 확인한다.

```ts
expect(afterDelete).toBeLessThan(beforeDeletes);
```

## E2E Testing

https://docs.nestjs.com/fundamentals/testing#end-to-end-testing

개별 모듈 및 클래스에 초점을 맞추는 단위 테스트와 달리, e2e 테스트는 보다 종합적인 수준에서 클래스와 모듈의 상호 작용을 다룬다.
또한 Nest를 사용하면 Supertest 라이브러리를 사용하여 HTTP 요청을 쉽게 시뮬레이션할 수 있다.

`request()` 함수를 사용하여 Nest 앱에서 실행 중인 HTTP 서버에 대한 테스트 요청을 시뮬레이션한다. 이를 위해 request() 함수에 Nest 앱의 HTTP 서버를 가리키는 참조(`app.getHttpServer()`)를 전달한다. 이렇게 하면 Supertest가 Nest 앱으로 요청을 보낼 수 있게 된다.
그 후에는 `request().get('/cats')`와 같이 사용하여 실제 HTTP 요청과 유사한 요청을 보낼 수 있다. 따라서 `request(app.getHttpServer()).get('/cats')`는 네트워크를 통해 `/cats`로 들어오는 실제 HTTP 요청과 동일한 요청을 Nest 앱으로 보내게 된다.

# HTTP 상태 코드

- 2xx - 성공
- 4xx - 에러 📌 중요

| 상태 코드 | 이름                  | 설명                                                                                                  |
| --------- | --------------------- | ----------------------------------------------------------------------------------------------------- |
| 200       | OK                    | 요청이 성공했음을 나타냄. 클라이언트가 요청한 작업을 성공적으로 처리함을 의미함.                      |
| 201       | Created               | 새로운 리소스가 성공적으로 생성됨. 서버가 요청을 성공적으로 처리하고 새로운 리소스를 생성함을 의미함. |
| 204       | No Content            | 리소스 삭제 성공. 요청된 작업이 성공적으로 수행되었지만 응답 본문에는 컨텐츠가 없음을 의미함.         |
| 400       | Bad Request           | 클라이언트의 요청이 잘못된 형식이거나 서버가 처리할 수 없는 경우 발생함.                              |
| 401       | Unauthorized          | 비인증 상태에서의 접근 시도. 요청된 리소스에 접근하기 위해서는 인증이 필요함을 의미함.                |
| 403       | Forbidden             | 인증은 되었지만, 해당 리소스에 대한 권한이 없는 경우 발생함.                                          |
| 404       | Not Found             | 요청한 리소스를 찾을 수 없음. 클라이언트가 요청한 리소스나 경로가 서버에 존재하지 않음을 의미함.      |
| 405       | Method Not Allowed    | 요청된 메서드를 사용할 수 없음. 요청된 URL에서 허용되지 않는 HTTP 메서드를 사용했을 때 발생함.        |
| 409       | Conflict              | 리소스 충돌이 발생한 경우. 클라이언트 요청이 서버 상태와 충돌하는 경우에 발생함.                      |
| 500       | Internal Server Error | 서버 내부 오류. 서버에서 요청을 처리하는 동안 예기치 않은 오류가 발생한 경우에 발생함.                |

# API 설계

## GET /users/?limit=N

주로 복수형을 적음

- 성공시 유저 객체를 담은 배열을 응답한다.최대 limit 갯수만큼 응답한다.
- 실패(예외)시 limit이 숫자형이 아니면 400을 응답한다.

## GET /users/:id

- 성공시 id가 1인 유저 객체를 반환한다.
- 실패(예외)시 id가 숫자형이 아니면 400, id로 유저를 찾을 수 없을 경우 404를 응답한다.

## DELETE /users/:id

- 성공시 id가 3인 유저를 삭제하고 204를 반환한다.
- 실패(예외)시 id가 숫자형이 아니면 400를 응답한다.

## POST /users

- 성공시 201 상태 코드를 반환한다.

  - 생성된 유저 객체를 반환한다.
  - 입력한 name을 반환한다.

- 실패(예외)시 name 파아미러 누락시 400를 반환한다.
  - name이 중복일 경우 400을 반환한다.

[맨 위로 이동](#readme)
