import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { EMPTY, expand, map, Observable, reduce } from 'rxjs';
import { environment } from 'src/environments/environment';

interface GetCourseResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Course[];
}

export interface Course {
  id: number;
  title: string;
  leadin: string;
  topics: string;
  requirements: string;
  self_catering: boolean;
  targets: string;
  remark: string;
  date_from: string;
  date_until: string;
  date_bookable: string;
  training_type: string;
  location: string;
  price: string;
  code: string;
  available: boolean;
  max_participants: number;
  booking_cycle: string;
}

@Injectable({
  providedIn: 'root',
})
export class CourseService {
  private baseUrl = environment.backendUrl ?? '/api';
  http = inject(HttpClient);

  /**
   * Retrieve all courses.
   * @returns List of all courses.
   */
  allCourses(bookingCycle: string | null = null): Observable<Course[]> {
    const resolvedBookingCycle =
      bookingCycle ?? String(new Date().getFullYear());
    const params = new HttpParams().set('booking_cycle', resolvedBookingCycle);
    params.set('page_size', '100');
    const url = `${this.baseUrl}/remote/trainings/`;
    return this.fetchAllCourses(url, params);
  }

  /**
   * Retrieve my courses.
   * @returns List of my courses.
   */
  myCourses(): Observable<Course[]> {
    const params = new HttpParams().set('page_size', '100');
    const url = `${this.baseUrl}/remote/trainings/my-trainings/`;
    return this.fetchAllCourses(url, params);
  }

  private fetchAllCourses(
    url: string,
    params: HttpParams,
  ): Observable<Course[]> {
    return this.http.get<GetCourseResponse>(url, { params }).pipe(
      expand((response) =>
        response.next
          ? this.http.get<GetCourseResponse>(url, {
              params: new HttpParams({
                fromString: new URL(response.next, url).searchParams.toString(),
              }),
            })
          : EMPTY,
      ),
      map((response) => response.results),
      reduce((all, results) => all.concat(results), [] as Course[]),
    );
  }
}
