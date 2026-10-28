import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import {
  ExpenseConfigDTO,
  ExpenseConfigService,
} from './expense-config.service';

const dto: ExpenseConfigDTO = {
  allowed: ['transport', 'food'],
  transport: {
    car: [0.3, 0.35],
    public: { none: 1, BC25: 0.75, BC50: 0.5 },
    bike: 0.1,
    plan: 10,
  },
  food: { arrival: 14, full: 28, departure: 15, single_day: 12 },
  maxTotal: 100,
};

describe('ExpenseConfigService', () => {
  let service: ExpenseConfigService;
  let http: HttpTestingController;

  // Requests are matched by path only, so the tests do not depend on the
  // configured backend URL. No request ever leaves the test.
  const request = (path: string, method = 'GET') =>
    http.expectOne(
      (r) => r.method === method && r.urlWithParams.endsWith(path),
    );
  const noRequest = (path: string) =>
    http.expectNone((r) => r.urlWithParams.endsWith(path));

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(ExpenseConfigService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  describe('getConfig', () => {
    it('should map the backend DTO to the expense config', () => {
      const next = vi.fn();
      service.getConfig('course').subscribe(next);
      request('/reimbursement-config/course').flush(dto);

      expect(next).toHaveBeenCalledWith({
        allowed: ['transport', 'food'],
        transport: dto.transport,
        food: { arrival: 14, return: 15, intermediate: 28, single: 12 },
        maxTotal: 100,
      });
    });

    it('should leave out food and maximum total when not configured', () => {
      const next = vi.fn();
      service.getConfig('course').subscribe(next);
      request('/reimbursement-config/course').flush({
        ...dto,
        food: undefined,
        maxTotal: null,
      });

      const config = next.mock.calls[0][0];
      expect(config.food).toBeUndefined();
      expect(config.maxTotal).toBeUndefined();
    });

    it('should request the config once per meeting type', () => {
      service.getConfig('course').subscribe();
      service.getConfig('course').subscribe();
      request('/reimbursement-config/course').flush(dto);

      service.getConfig('course').subscribe();
      noRequest('/reimbursement-config/course');

      service.getConfig('committee').subscribe();
      request('/reimbursement-config/committee').flush(dto);
    });

    it('should request the config for a date without caching it', () => {
      service.getConfig('course', new Date(2025, 2, 5)).subscribe();
      request('/reimbursement-config/course?date=2025-03-05').flush(dto);

      service.getConfig('course', new Date(2025, 2, 5)).subscribe();
      request('/reimbursement-config/course?date=2025-03-05').flush(dto);
    });

    it('should not use the cache when a date is given', () => {
      service.getConfig('course').subscribe();
      request('/reimbursement-config/course').flush(dto);

      service.getConfig('course', new Date(2024, 11, 24)).subscribe();
      request('/reimbursement-config/course?date=2024-12-24').flush(dto);
    });

    it('should retry after a failed request', () => {
      const error = vi.fn();
      service.getConfig('course').subscribe({ error });
      request('/reimbursement-config/course').flush('nope', {
        status: 500,
        statusText: 'Server Error',
      });
      expect(error).toHaveBeenCalled();

      const next = vi.fn();
      service.getConfig('course').subscribe(next);
      request('/reimbursement-config/course').flush(dto);
      expect(next).toHaveBeenCalled();
    });
  });

  describe('getCurrentConfig', () => {
    it('should return the raw DTO', () => {
      const next = vi.fn();
      service.getCurrentConfig('committee').subscribe(next);
      request('/reimbursement-config/committee').flush(dto);
      expect(next).toHaveBeenCalledWith(dto);
    });
  });

  describe('updateConfig', () => {
    it('should post the config with a validity date', () => {
      service.updateConfig('course', dto).subscribe();

      const req = request('/reimbursement-config/course', 'POST');
      expect(req.request.body).toEqual({
        ...dto,
        valid_from: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T/),
      });
      req.flush(null);
    });

    it('should invalidate the cached config after a successful update', () => {
      service.getConfig('course').subscribe();
      request('/reimbursement-config/course').flush(dto);

      service.updateConfig('course', dto).subscribe();
      request('/reimbursement-config/course', 'POST').flush(null);

      service.getConfig('course').subscribe();
      request('/reimbursement-config/course').flush(dto);
    });

    it('should keep the cache when the update fails', () => {
      service.getConfig('course').subscribe();
      request('/reimbursement-config/course').flush(dto);

      service.updateConfig('course', dto).subscribe({ error: () => undefined });
      request('/reimbursement-config/course', 'POST').flush('nope', {
        status: 500,
        statusText: 'Server Error',
      });

      service.getConfig('course').subscribe();
      noRequest('/reimbursement-config/course');
    });
  });
});
