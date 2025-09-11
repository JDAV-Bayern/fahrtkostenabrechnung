import { Injectable } from '@angular/core';
import { plzs } from 'src/data/plzs';

@Injectable({
  providedIn: 'root',
})
export class PlzService {
  search(prefix: string) {
    if (prefix.length <= 3) {
      return [];
    }
    return plzs
      .filter((val) => val[0].startsWith(prefix))
      .map((val) => ({ plz: val[0], city: val[1] }));
  }

  exists(plz: string, city: string) {
    return plzs.some((val) => val[0] === plz && val[1] === city);
  }
}
