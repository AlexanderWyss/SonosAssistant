import { Injectable } from '@nestjs/common';
import { SonosManager } from '@svrooij/sonos';
import SonosDevice from '@svrooij/sonos/lib/sonos-device';

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
  }

  getDevices(): string[] {
    return this.manager.Devices.map(d => d.Name);
  }


  getDeviceByName(groupDeviceName: string): SonosDevice {
    return this.manager.Devices.filter(device => device.Name === groupDeviceName)[0];
  }

  leaveGroup(device: SonosDevice) {
    device.AVTransportService.BecomeCoordinatorOfStandaloneGroup().catch(console.error);
  }
}
