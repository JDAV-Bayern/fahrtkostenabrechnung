import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { LocalityDto } from 'src/domain/address.dto';
import { Locality } from 'src/domain/address.model';

@Injectable({
  providedIn: 'root'
})
export class LocalityService {
  constructor(private http: HttpClient) {}

  search(prefix: string): Observable<Locality[]> {
    if (prefix.length <= 3) {
      return of([]);
    }

    return this.http
      .get<LocalityDto[]>('/api/localities', {
        params: { postal_code: prefix }
      })
      .pipe(
        map(localities =>
          localities.map(dto => ({
            postalCode: dto.postal_code,
            name: dto.name,
            countryId: dto.country_id
          }))
        )
      );
  }

  exists(plz: string, city: string): Observable<boolean> {
    return this.search(plz).pipe(
      map(localities =>
        localities.some(val => val.postalCode === plz && val.name === city)
      )
    );
  }
}
