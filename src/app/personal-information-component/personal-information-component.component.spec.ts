import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalInformationComponentComponent } from './personal-information-component.component';

describe('PersonalInformationComponentComponent', () => {
  let component: PersonalInformationComponentComponent;
  let fixture: ComponentFixture<PersonalInformationComponentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PersonalInformationComponentComponent]
    });
    fixture = TestBed.createComponent(PersonalInformationComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
