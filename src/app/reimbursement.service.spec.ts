import { TestBed } from '@angular/core/testing';

import { ReimbursementService } from './reimbursement.service';

describe('ReimbursementService', () => {
  let service: ReimbursementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReimbursementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
