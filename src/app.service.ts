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
    let phonetic = colognePhonetic(text).toString();
    console.log('phon: ' + phonetic);
    const add = colognePhonetic('nzufügen').toString();
    console.log('add: ' + add);
    if (phonetic.endsWith(add)) {
      console.log('true');
      phonetic = phonetic.substring(0, phonetic.length - add.length);
      console.log('phon: ' + phonetic);
      const split = phonetic.split(colognePhonetic('zu').toString());
      for (let i = 0; i < (split.length - 1); i++) {
        let left = split[0];
        for (let j = 1; j <= i; j++) {
          left = left + colognePhonetic('zu').toString()+ split[j];
        }
        let right = split[i + 1];
        for (let j = i + 2; j < split.length; j++) {
          right = right + colognePhonetic('zu').toString() + split[j];
        }
        console.log('left: ' + left);
        console.log('right: ' + right);
        const device = this.getDeviceByPhonetic(left);
        const group = this.getDeviceByPhonetic(right);
        if (device && group) {
          console.log('match: ' + device.Name  + " add to "+ group.Name);
          device.JoinGroup(group.Name).catch(console.error);
          break;
        }
      }
    }
  }

  getDevices(): string[] {
    return this.manager.Devices.map(d => d.Name);
  }


  getDeviceByName(deviceName: string): SonosDevice {
    return this.manager.Devices.filter(device => device.Name === deviceName)[0];
  }

  getDeviceByPhonetic(deviceName: string): SonosDevice {
    const filter = this.manager.Devices.filter(device => colognePhonetic(device.Name) === deviceName);
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
