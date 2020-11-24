import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { PresetService } from './preset/preset.service';

@Module({
  imports: [
    ServeStaticModule.forRoot(
      {
        rootPath: join(__dirname, './client/'),
      },
    ),
    ServeStaticModule.forRoot(
      {
        rootPath: join(__dirname, './tts/'),
        serveRoot: '/tts',
      },
    ),
  ],
  controllers: [AppController],
  providers: [AppService, PresetService],
})
export class AppModule {
}
