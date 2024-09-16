import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Course, CourseDto } from 'src/domain/meeting.model';
import { SectionService } from './section.service';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  constructor(
    private http: HttpClient,
    private sectionService: SectionService
  ) {}

  private mapCourseDto = (dto: CourseDto): Course => ({
    ...dto,
    startDate: new Date(dto.start_date),
    endDate: new Date(dto.end_date),
    federation$: this.sectionService.getFederation(dto.federation)
  });

  getCourses(): Observable<Course[]> {
    return this.http
      .get<CourseDto[]>('/api/courses')
      .pipe(map(courses => courses.map(course => this.mapCourseDto(course))));
  }

  getCourse(id: number): Observable<Course> {
    return this.http
      .get<CourseDto>(`/api/courses/${id}`)
      .pipe(map(course => this.mapCourseDto(course)));
  }
}
