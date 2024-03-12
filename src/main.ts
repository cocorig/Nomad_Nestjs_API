import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app/app.module';
import { NestFactory } from '@nestjs/core';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  await app.listen(3000);
}
bootstrap();

// 유효성 검사 파이프(ex.미들웨어)를 만들자
// 그 전에  class-validator , class-transformer 을 설치하자
// dto에서 유효성 검사!
// whitelist: https://github.com/typestack/class-validator?tab=readme-ov-file#whitelisting
// whitelist : DTO에 정의되지 않은 속성은 무시된다.forbidNonWhitelisted: DTO에 정의되지 않은 속성이 있으면 요청이 거부된다.
// 즉 요청이 오면, DTO 클래스에 정의된 속성만 허용되며, 정의되지 않은 속성이나 타입이 잘못된 속성이 있으면 요청이 거부할 수 있다. (요청 자체를 막음)
// transform는 우리가 원하는 타입으로 자동으로 변환해주는 옵션
// 그럼 각 매개변수 타입 자리에 ParseIntPipe 안 써줘도 되겠네??
