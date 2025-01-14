import { FormControl, FormGroup } from '@angular/forms';
import { MeetingType } from 'src/domain/meeting.model';

export interface MeetingForm {
  type: FormControl<MeetingType>;
  name: FormControl<string>;
  location: FormControl<string>;
  time: FormGroup<{
    start: FormControl<Date | null>;
    end: FormControl<Date | null>;
  }>;
  code?: FormControl<string>;
}
