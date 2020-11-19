import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('api')
  @HttpCode(200)
  api(@Body('text') text: string): void {
    this.appService.call(text);
  }
}
