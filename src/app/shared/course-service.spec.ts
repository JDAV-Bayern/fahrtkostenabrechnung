import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Course, CourseService } from './course-service';

const ALL_COURSES = '/remote/trainings/';
const MY_COURSES = '/remote/trainings/my-trainings/';

// The host is irrelevant for the service, only the query string of the
// next link is used.
const nextLink = (page: number) =>
  `https://backend.test${ALL_COURSES}?booking_cycle=2024&page_size=100&page=${page}`;

const course = (id: number) => ({ id, title: `Kurs ${id}` }) as Course;

const page = (results: Course[], next: string | null = null) => ({
  count: results.length,
  next,
  previous: null,
  results,
});

describe('CourseService', () => {
  let service: CourseService;
  let http: HttpTestingController;

  // Requests are matched by path only, so the tests do not depend on the
  // configured backend URL. No request ever leaves the test.
  const request = (path: string, pageNumber?: string) =>
    http.expectOne(
      (r) =>
        r.url.endsWith(path) &&
        (pageNumber === undefined || r.params.get('page') === pageNumber),
    );

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(CourseService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  describe('allCourses', () => {
    it('should request the given booking cycle', () => {
      service.allCourses('2024').subscribe();
      const req = request(ALL_COURSES);
      expect(req.request.params.get('booking_cycle')).toBe('2024');
      expect(req.request.params.get('page_size')).toBe('100');
      req.flush(page([]));
    });

    it('should default to the current year', () => {
      service.allCourses().subscribe();

      const req = request(ALL_COURSES);
      expect(req.request.params.get('booking_cycle')).toBe(
        String(new Date().getFullYear()),
      );
      req.flush(page([]));
    });

    it('should return the courses of a single page', () => {
      const next = vi.fn();
      service.allCourses('2024').subscribe(next);

      request(ALL_COURSES).flush(page([course(1), course(2)]));

      expect(next).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledWith([course(1), course(2)]);
    });

    it('should follow the next link and merge all pages in order', () => {
      const next = vi.fn();
      service.allCourses('2024').subscribe(next);

      request(ALL_COURSES).flush(page([course(1), course(2)], nextLink(2)));

      const second = request(ALL_COURSES, '2');
      expect(second.request.params.get('booking_cycle')).toBe('2024');
      expect(second.request.params.get('page_size')).toBe('100');
      second.flush(page([course(3)], nextLink(3)));

      request(ALL_COURSES, '3').flush(page([course(4)]));

      expect(next).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledWith([
        course(1),
        course(2),
        course(3),
        course(4),
      ]);
    });
  });

  describe('myCourses', () => {
    it('should request the courses of the user', () => {
      const next = vi.fn();
      service.myCourses().subscribe(next);

      const req = request(MY_COURSES);
      expect(req.request.params.get('page_size')).toBe('100');
      expect(req.request.params.has('booking_cycle')).toBe(false);
      req.flush(page([course(7)]));

      expect(next).toHaveBeenCalledWith([course(7)]);
    });
  });
});
