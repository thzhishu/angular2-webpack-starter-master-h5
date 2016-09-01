import { Injectable } from '@angular/core';
import { Subject }    from 'rxjs/Subject';

@Injectable()
export class MissionService {

  // Observable string sources
  private missionAnnouncedSource = new Subject<string>();
  private missionConfirmedSource = new Subject<string>();
  private businessAddAnnouncedSource = new Subject<any>();
  private businessAddConfirmedSource = new Subject<any>();

  // Observable string streams
  missionAnnounced$ = this.missionAnnouncedSource.asObservable();
  missionConfirmed$ = this.missionConfirmedSource.asObservable();
  businessAddAnnounced$ = this.businessAddAnnouncedSource.asObservable();
  businessAddConfirmed$ = this.businessAddConfirmedSource.asObservable();
  // Service message commands
  announceMission(mission: string) {
    this.missionAnnouncedSource.next(mission);
  }
  confirmMission(astronaut: string) {
    this.missionConfirmedSource.next(astronaut);
  }
  announceBusinessAdd(ba: any) {
    this.businessAddAnnouncedSource.next(ba);
  }
  confirmBusinessAdd(ba: any) {
    this.businessAddConfirmedSource.next(ba);
  }
}
