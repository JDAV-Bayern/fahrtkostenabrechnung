import { Injectable } from '@angular/core';
import { plzs } from '../data/plzs';

@Injectable({
  providedIn: 'root'
})
export class PlzService {
  search(prefix: string) {
    if (prefix.length <= 3) {
      return [];
    }
    return plzs
      .filter(val => val[0].startsWith(prefix))
      .map(val => ({ plz: val[0], city: val[1] }));
  }

  exists(plz: string) {
    return plzs.some(val => val[0] === plz);
  }
}
