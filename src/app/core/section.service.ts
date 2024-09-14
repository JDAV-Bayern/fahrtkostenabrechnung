import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import {
  Federation,
  FederationDto,
  Section,
  SectionDto
} from 'src/domain/section.model';

@Injectable({
  providedIn: 'root'
})
export class SectionService {
  private readonly http = inject(HttpClient);

  private mapFederationDto = (dto: FederationDto): Federation => ({
    ...dto,
    parent$: dto.parent ? this.getFederation(dto.parent) : null,
    sections$: this.getSections(dto.id)
  });

  private mapSectionDto = (dto: SectionDto): Section => ({
    ...dto,
    state$: this.getFederation(dto.state),
    district$: dto.district ? this.getFederation(dto.district) : null
  });

  getFederations(): Observable<Federation[]> {
    return this.http
      .get<FederationDto[]>('/api/federations')
      .pipe(
        map(federations =>
          federations.map(federation => this.mapFederationDto(federation))
        )
      );
  }

  getFederation(id: number): Observable<Federation> {
    return this.http
      .get<FederationDto>(`/api/federations/${id}`)
      .pipe(map(federation => this.mapFederationDto(federation)));
  }

  getSections(federationId?: number): Observable<Section[]> {
    const url = federationId
      ? `/api/federations/${federationId}/sections`
      : '/api/sections';
    return this.http
      .get<SectionDto[]>(url)
      .pipe(
        map(sections => sections.map(section => this.mapSectionDto(section)))
      );
  }

  getSection(id: number): Observable<Section> {
    return this.http
      .get<SectionDto>(`/api/sections/${id}`)
      .pipe(map(section => this.mapSectionDto(section)));
  }

  isBavarian(section: Section): Observable<boolean> {
    // TODO make this database driven
    return section.state$.pipe(map(state => state.name === 'Bayern'));
  }
}
