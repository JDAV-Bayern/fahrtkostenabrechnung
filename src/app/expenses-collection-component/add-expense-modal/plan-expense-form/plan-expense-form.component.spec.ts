import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanExpenseFormComponent } from './plan-expense-form.component';

describe('PlanExpenseFormComponent', () => {
  let component: PlanExpenseFormComponent;
  let fixture: ComponentFixture<PlanExpenseFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PlanExpenseFormComponent]
    });
    fixture = TestBed.createComponent(PlanExpenseFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
