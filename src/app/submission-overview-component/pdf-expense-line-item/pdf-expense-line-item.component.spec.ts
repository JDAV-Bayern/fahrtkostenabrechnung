import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PdfExpenseLineItemComponent } from './pdf-expense-line-item.component';

describe('PdfExpenseLineItemComponent', () => {
  let component: PdfExpenseLineItemComponent;
  let fixture: ComponentFixture<PdfExpenseLineItemComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PdfExpenseLineItemComponent]
    });
    fixture = TestBed.createComponent(PdfExpenseLineItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
