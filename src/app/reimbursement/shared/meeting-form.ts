import { FormControl, FormGroup } from '@angular/forms';
import { MeetingType } from 'src/domain/meeting.model';

export interface MeetingForm {
  type: FormControl<MeetingType>;
  name: FormControl<string>;
  location: FormControl<string>;
  time: FormGroup<{
    startDate: FormControl<Date | null>;
    startTime: FormControl<number>;
    endDate: FormControl<Date | null>;
    endTime: FormControl<number>;
  }>;
  code?: FormControl<string>;
}
