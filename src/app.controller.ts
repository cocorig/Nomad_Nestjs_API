import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get() // express의 get라우터
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/hello') // 데코레이터는 꾸며주는 함수와 클래스가 붙어있어야 한다.
  sayHi(): string {
    return this.appService.getHi();
  }
}
