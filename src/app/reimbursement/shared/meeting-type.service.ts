import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MeetingType } from 'src/domain/meeting.model';

@Injectable({
  providedIn: 'root',
})
export class MeetingTypeService {
  private readonly type$ = new BehaviorSubject<MeetingType>('course');

  readonly meetingType$ = this.type$.asObservable();

  set meetingType(type: MeetingType) {
    this.type$.next(type);
  }
}
