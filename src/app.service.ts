import { Injectable } from '@nestjs/common';
import { SonosManager } from '@svrooij/sonos';
import SonosDevice from '@svrooij/sonos/lib/sonos-device';
import { colognePhonetic } from 'cologne-phonetic';

@Injectable()
export class AppService {
  private manager: SonosManager;

  constructor() {
    this.manager = new SonosManager();
    this.manager.InitializeFromDevice('192.168.1.120')
      .then(console.log)
      .catch(console.error);
  }

  call(text: string) {
    console.log('api: ' + text);
    if (text.endsWith('hinzufügen')) {
      console.log('add');
      text = text.substring(0, text.length - 'hinzufügen'.length);
      const split = text.split('zu');
      const device = this.getDeviceByPhonetic(colognePhonetic(split[0]));
      const group = this.getDeviceByPhonetic(colognePhonetic(split[1]));
      if (device && group) {
        console.log('match: ' + device.Name + ' add to ' + group.Name);
        device.JoinGroup(group.Name).catch(console.error);
      }
    }
    if (text.endsWith('entfernen')) {
      console.log('remove');
      text = text.substring(0, text.length - 'entfernen'.length);
      const device = this.getDeviceByPhonetic(colognePhonetic(text));
      if (device) {
        console.log('match: remove ' + device.Name);
        this.leaveGroup(device);
      }
    }
  }

  getDevices(): string[] {
    return this.manager.Devices.map(d => d.Name);
  }


  getDeviceByName(deviceName: string): SonosDevice {
    return this.manager.Devices.filter(device => device.Name === deviceName)[0];
  }

  getDeviceByPhonetic(phonetic: string): SonosDevice {
    const filter = this.manager.Devices.filter(device => colognePhonetic(device.Name) === phonetic);
    if (filter.length > 0) {
      return filter[0];
    }
    return null;
  }

  leaveGroup(device: SonosDevice) {
    device.AVTransportService.BecomeCoordinatorOfStandaloneGroup().catch(console.error);
  }

  phoneticMatch(a: string, b: string): boolean {
    return colognePhonetic(a) === colognePhonetic(b);
  }
}
