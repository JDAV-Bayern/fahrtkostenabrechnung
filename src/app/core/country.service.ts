import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CountryDto } from 'src/domain/address.dto';
import { Country } from 'src/domain/address.model';

@Injectable({
  providedIn: 'root'
})
export class CountryService {
  constructor(private http: HttpClient) {}

  getCountries(): Observable<Country[]> {
    return this.http.get<CountryDto[]>('/api/countries');
  }

  getCountry(id: number): Observable<Country> {
    return this.http.get<CountryDto>(`/api/countries/${id}`);
  }
}
