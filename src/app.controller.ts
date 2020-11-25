import { Body, Controller, Get, HttpCode, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {
  }

  @Post('api')
  @HttpCode(200)
  api(@Body('text') text: string): void {
    this.appService.call(text);
  }

  @Post('api/add')
  @HttpCode(200)
  apiAdd(@Body('text') text: string): void {
    this.appService.add(text).catch(console.error);
  }

  @Post('api/remove')
  @HttpCode(200)
  apiRemove(@Body('text') text: string): void {
    this.appService.remove(text).catch(console.error);
  }
  @Post('api/preset')
  @HttpCode(200)
  apiPreset(@Body('name') name: string): void {
    this.appService.preset(name);
  }

  @Post('api/tts')
  @HttpCode(200)
  ttsGenerate(@Body('text') text: string) {
    return {
      uri: 'https://sonos.wyss.tech/assets/test.wav'
    }
  }

  @Get('test/tts')
  ttsTest() {
    this.appService.getDeviceByName('Alexander').PlayTTS({
      endpoint: 'https://sonos.wyss.tech/api/tts',
      lang: 'de',
      text: 'test',
    }).then(console.log).catch(console.error);
  }

  @Post('add')
  @HttpCode(200)
  add(@Body('deviceName') deviceName: string, @Body('groupDeviceName') groupDeviceName: string): void {
    this.appService.getDeviceByName(deviceName).JoinGroup(groupDeviceName).catch(console.error);
  }

  @Post('remove')
  @HttpCode(200)
  remove(@Body('deviceName') deviceName: string): void {
    this.appService.leaveGroup(this.appService.getDeviceByName(deviceName)).catch(console.error);
  }

  @Get('devices')
  devices(): string[] {
    return this.appService.getDevices();
  }
}
