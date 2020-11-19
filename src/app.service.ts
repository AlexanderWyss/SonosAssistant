import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  call(text: string) {
    console.log('api: ' + text);
  }
}
