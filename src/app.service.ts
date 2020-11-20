import { Injectable } from '@nestjs/common';
import { SonosManager } from '@svrooij/sonos';
import SonosDevice from '@svrooij/sonos/lib/sonos-device';
import { colognePhonetic } from 'cologne-phonetic';
import { PresetService } from './preset/preset.service';

@Injectable()
export class AppService {
  private manager: SonosManager;

  constructor(private readonly presetService: PresetService) {
    this.manager = new SonosManager();
    this.manager.InitializeFromDevice('192.168.1.120')
      .then(console.log)
      .catch(console.error);
  }

  call(text: string) {
    console.log('api: ' + text);
    if (text.endsWith('hinzufügen')) {
      this.add(text.substring(0, text.length - 'hinzufügen'.length));
    }
    if (text.endsWith('entfernen')) {
      this.remove(text.substring(0, text.length - 'entfernen'.length));
    }
  }

  add(text: string) {
    console.log('add: ' + text);
    const split = text.split(' zu ');
    const device = this.getDeviceByPhonetic(split[0]);
    const group = this.getDeviceByPhonetic(split[1]);
    if (device && group) {
      console.log('match: ' + device.Name + ' add to ' + group.Name);
      device.JoinGroup(group.Name).catch(console.error);
    }
  }

  remove(text: string) {
    console.log('remove: ' + text);
    const device = this.getDeviceByPhonetic(text);
    if (device) {
      console.log('match: remove ' + device.Name);
      this.leaveGroup(device);
    }
  }

  preset(name: string) {
    console.log('preset: ' + name);
    const preset = this.presetService.getPresetByName(name);
    if (preset && preset.length > 0) {
      console.log('match: preset ' + name + ' [' + preset.toString() + ']');
      const group = preset[0];
      this.leaveGroup(this.getDeviceByName(group));
      for(let i = 1; i < preset.length; i++) {
        this.getDeviceByName(preset[i]).JoinGroup(group).catch(console.error);
      }
    }
  }

  getDeviceByPhonetic(deviceName: string): SonosDevice {
    const phoneticDeviceName = colognePhonetic(deviceName);
    const filter = this.manager.Devices.filter(device => colognePhonetic(device.Name) === phoneticDeviceName);
    if (filter.length > 0) {
      return filter[0];
    }
    return null;
  }

  leaveGroup(device: SonosDevice) {
    device.AVTransportService.BecomeCoordinatorOfStandaloneGroup().catch(console.error);
  }

  getDevices(): string[] {
    return this.manager.Devices.map(d => d.Name);
  }

  getDeviceByName(deviceName: string): SonosDevice {
    return this.manager.Devices.filter(device => device.Name.toLowerCase() === deviceName.toLowerCase())[0];
  }
}
