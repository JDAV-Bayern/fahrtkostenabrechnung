import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SectionDTOType } from 'src/app/shared/generated-types/generated-types';

@Component({
  selector: 'app-section-form',
  imports: [],
  templateUrl: './section-form.component.html',
  styleUrl: './section-form.component.css'
})
export class SectionFormComponent {
  @Input()
  section: SectionDTOType | undefined;

  @Output()
  cancel = new EventEmitter<void>();

  @Output()
  save = new EventEmitter<SectionDTOType>();
}
