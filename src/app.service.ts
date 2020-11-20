import { Injectable } from '@nestjs/common';
import { SonosManager } from '@svrooij/sonos';
import SonosDevice from '@svrooij/sonos/lib/sonos-device';
import { colognePhonetic } from 'cologne-phonetic';
import { PresetService } from './preset/preset.service';
import { BecomeCoordinatorOfStandaloneGroupResponse } from '@svrooij/sonos/lib/services';

@Injectable()
export class AppService {
  private manager: SonosManager;

  constructor(private readonly presetService: PresetService) {
    this.initializeSonosManager();
  }

  private initializeSonosManager() {
    const manager = new SonosManager();
    manager.InitializeFromDevice('192.168.1.120')
      .catch(console.error)
      .finally(() => {
        this.manager = manager;
        console.log('initialized');
        setTimeout(() => this.initializeSonosManager(), 3600000);
      });
  }

  call(text: string) {
    console.log('api: ' + text);
    if (text.endsWith('hinzufügen')) {
      this.add(text.substring(0, text.length - 'hinzufügen'.length)).catch(console.error);
    }
    if (text.endsWith('entfernen')) {
      this.remove(text.substring(0, text.length - 'entfernen'.length)).catch(console.error);
    }
  }

  async add(text: string) {
    console.log('add: ' + text);
    const split = text.split(' zu ');
    const devices = this.getDevicesByPhonetic(split[0]);
    const group = this.getDeviceByPhonetic(split[1]);
    if (devices && devices.length > 0 && group) {
      console.log('match: [' + devices.map(device => device.Name).toString() + '] added to ' + group.Name);
      for (const device of devices) {
        await device.JoinGroup(group.Name);
      }
    }
  }

  async remove(text: string) {
    console.log('remove: ' + text);
    const devices = this.getDevicesByPhonetic(text);
    if (devices && devices.length > 0) {
      console.log('match: remove [' + devices.map(device => device.Name).toString() + ']');
      for (const device of devices) {
        await this.leaveGroup(device);
      }
    }
  }

  preset(name: string) {
    console.log('preset: ' + name);
    const preset = this.presetService.getPresetByName(name);
    console.log(preset);
    if (preset && preset.length > 0) {
      console.log('match: preset ' + name + ' [' + preset.toString() + ']');
      const group = preset[0];
      const device = this.getDeviceByName(group);
      device.ZoneGroupTopologyService.GetParsedZoneGroupState().then(async zones => {
        const zone = zones.find(zone =>
          zone.members.find(member => member.name.toLowerCase() === group.toLowerCase()));
        if (zone && zone.members.length > 1) {
          await this.leaveGroup(device);
          await new Promise(resolve => setTimeout(resolve, 500));
        }
        for (let i = 1; i < preset.length; i++) {
          await this.getDeviceByName(preset[i]).JoinGroup(group);
        }
      });
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

  getDevicesByPhonetic(text: string): SonosDevice[] {
    return text.split(' und ').map(deviceName => this.getDeviceByPhonetic(deviceName));
  }

  leaveGroup(device: SonosDevice): Promise<BecomeCoordinatorOfStandaloneGroupResponse> {
    return device.AVTransportService.BecomeCoordinatorOfStandaloneGroup();
  }

  getDevices(): string[] {
    return this.manager.Devices.map(d => d.Name);
  }

  getDeviceByName(deviceName: string): SonosDevice {
    return this.manager.Devices.filter(device => device.Name.toLowerCase() === deviceName.toLowerCase())[0];
  }
}
