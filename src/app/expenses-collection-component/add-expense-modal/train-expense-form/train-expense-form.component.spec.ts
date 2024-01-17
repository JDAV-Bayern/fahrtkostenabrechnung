import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainExpenseFormComponent } from './train-expense-form.component';

describe('TrainExpenseFormComponent', () => {
  let component: TrainExpenseFormComponent;
  let fixture: ComponentFixture<TrainExpenseFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TrainExpenseFormComponent]
    });
    fixture = TestBed.createComponent(TrainExpenseFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
