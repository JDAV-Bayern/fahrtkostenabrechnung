import { Injectable } from '@angular/core';
import { BehaviorSubject, distinctUntilChanged } from 'rxjs';
import { MeetingType } from 'src/domain/meeting.model';

@Injectable({
  providedIn: 'root',
})
export class MeetingTypeService {
  private readonly type$ = new BehaviorSubject<MeetingType>('course');

  readonly meetingType$ = this.type$.pipe(distinctUntilChanged());

  set meetingType(type: MeetingType) {
    this.type$.next(type);
  }
}
