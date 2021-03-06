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
  apiTts(@Body('text') text: string) {
    console.log("api tts: " + text);
    const split = text.trim().split(' ');
    if (split && split.length > 1) {
      const device = split.shift();
      const text = split.join(' ');
      this.appService.getDeviceByPhonetic(device).PlayTTS({
        endpoint: 'https://tts.wyss.tech/api/tts',
        lang: 'de',
        text: text,
      }).then(console.log).catch(console.error);
    }
  }

  @Post('test/tts')
  ttsTest(@Body('text') text: string, @Body('device') device: string) {
    this.appService.getDeviceByName(device).PlayTTS({
      endpoint: 'https://tts.wyss.tech/api/tts',
      lang: 'de',
      text: text,
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
