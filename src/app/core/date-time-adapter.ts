import { Injectable } from '@angular/core';
import { NativeDateTimeAdapter } from '@danielmoncada/angular-datetime-picker';

@Injectable({ providedIn: 'root' })
export class JdavDateTimeAdapter extends NativeDateTimeAdapter {
  override parse(value: string | null, parseFormat?: any): Date | null {
    if (!value) {
      return null;
    }

    const match = value.match(parseFormat);
    if (!match) {
      return new Date(NaN);
    }

    // allow 2 digit years
    if (match[3].length === 2) {
      let currentYear = new Date().getFullYear();
      if (currentYear % 100 < parseInt(match[3])) {
        currentYear -= 100;
      }
      match[3] = currentYear.toString().slice(0, -2) + match[3];
    }

    const groups = match.slice(1).map(v => (v ? parseInt(v) : 0));
    return new Date(groups[2], groups[1] - 1, groups[0], groups[3], groups[4]);
  }
}
