import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';

export interface Locality {
  postal_code: string;
  name: string;
  country: number;
}

@Injectable({
  providedIn: 'root'
})
export class LocalityService {
  constructor(private http: HttpClient) {}

  search(prefix: string): Observable<Locality[]> {
    if (prefix.length <= 3) {
      return of([]);
    }

    return this.http.get<Locality[]>('/api/localities', {
      params: { postal_code: prefix }
    });
  }

  exists(plz: string, city: string): Observable<boolean> {
    return this.search(plz).pipe(
      map(localities =>
        localities.some(val => val.postal_code === plz && val.name === city)
      )
    );
  }
}
