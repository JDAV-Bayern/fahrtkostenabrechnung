import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PdfViewComponent } from './pdf-view.component';

describe('PdfViewComponent', () => {
  let component: PdfViewComponent;
  let fixture: ComponentFixture<PdfViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PdfViewComponent]
    });
    fixture = TestBed.createComponent(PdfViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
