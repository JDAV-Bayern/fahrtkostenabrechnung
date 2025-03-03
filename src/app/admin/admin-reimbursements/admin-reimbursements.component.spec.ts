import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminReimbursementsComponent } from './admin-reimbursements.component';

describe('AdminReimbursementsComponent', () => {
  let component: AdminReimbursementsComponent;
  let fixture: ComponentFixture<AdminReimbursementsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminReimbursementsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminReimbursementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
