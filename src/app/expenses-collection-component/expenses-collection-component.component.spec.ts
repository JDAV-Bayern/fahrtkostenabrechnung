import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpensesCollectionComponentComponent } from './expenses-collection-component.component';

describe('ExpensesCollectionComponentComponent', () => {
  let component: ExpensesCollectionComponentComponent;
  let fixture: ComponentFixture<ExpensesCollectionComponentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExpensesCollectionComponentComponent]
    });
    fixture = TestBed.createComponent(ExpensesCollectionComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
