import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenseListRowComponent } from './expense-list-row.component';

describe('ExpenseListRowComponent', () => {
  let component: ExpenseListRowComponent;
  let fixture: ComponentFixture<ExpenseListRowComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExpenseListRowComponent]
    });
    fixture = TestBed.createComponent(ExpenseListRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
