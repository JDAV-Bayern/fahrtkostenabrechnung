import { FormControl } from '@angular/forms';
import { MeetingType } from 'src/domain/meeting.model';

export type DateRange = [Date | null, Date | null];

export type MeetingForm = {
  type: FormControl<MeetingType>;
  name: FormControl<string>;
  location: FormControl<string>;
  period: FormControl<DateRange>;
  code?: FormControl<string>;
};
