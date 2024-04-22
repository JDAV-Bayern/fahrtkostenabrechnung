import { Pipe, PipeTransform } from '@angular/core';
import { MeetingType } from 'src/domain/meeting.model';

@Pipe({
  name: 'meetingType',
  standalone: true
})
export class MeetingTypePipe implements PipeTransform {
  transform(value: MeetingType): string {
    switch (value) {
      case 'course':
        return 'Kurs';
      case 'assembly':
        return 'LJV';
      case 'committee':
        return 'Gremium';
    }
  }
}
