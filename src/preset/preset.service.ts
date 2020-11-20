import { Injectable } from '@nestjs/common';

@Injectable()
export class PresetService {
  private presets = {
    alexander: ['Alexander', 'Bad', 'Küche', 'Mobil'],
    bad: ['Alexander', 'Bad'],
    küche: ['Alexander', 'Küche'],
    party: ['Alexander', 'Bad', 'Küche', 'Mobil', 'Adam', 'Schlafzimmer Simone', 'Adrian‘s TV Room']
  };

  getPresetByName(name: string): string[] {
    return this.presets[name.toLowerCase().trim()];
  }
}
