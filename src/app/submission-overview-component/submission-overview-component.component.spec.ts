import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmissionOverviewComponentComponent } from './submission-overview-component.component';

describe('SubmissionOverviewComponentComponent', () => {
  let component: SubmissionOverviewComponentComponent;
  let fixture: ComponentFixture<SubmissionOverviewComponentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SubmissionOverviewComponentComponent]
    });
    fixture = TestBed.createComponent(SubmissionOverviewComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
