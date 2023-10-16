import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ScheduleListReq } from 'src/app/model/thing-to-do/insert-tour/schedule-list.-req';
import { Schedule } from 'src/app/model/thing-to-do/insert-tour/shedule';
import { ExtrasPackage } from 'src/app/model/thing-to-do/insert-tour/extras-package';
import { TourInsertService } from 'src/app/service/extras/tour-insert.service';
import { thingToDoConstant } from '../../thing-to-do.constant';

@Component({
  selector: 'app-schedule-list',
  templateUrl: './schedule-list.component.html',
  styleUrls: ['./schedule-list.component.css']
})
export class ScheduleListComponent implements OnInit {

  tourId: string;
  tourDetail: ExtrasPackage;
  schedules: Schedule[];
  constructor(
    private activeRoute: ActivatedRoute,
    protected router: Router,
    private tourDataService: TourInsertService
  ) { }

  ngOnInit() {
    this.tourDetail = JSON.parse(sessionStorage.getItem(thingToDoConstant.TOUR_EDIT));
    this.activeRoute.params.subscribe((params: Params) => {
      this.tourId = params['tourId'];
    });
    if (this.tourId != null) {
      // const data = new ScheduleListReq();
      // data.tourId = this.tourId;
      this.tourDataService.extraDetailList(this.tourId).subscribe(
        (res: Schedule[]) => {
          this.schedules = res;
          // console.log(res);
        }
      )
    }
  }
  addExtraDetail(){
    this.router.navigate(['../../schedule'], { relativeTo: this.activeRoute });
  }
  editSchedule(schedule: Schedule){
    this.router.navigate(['../../schedule', schedule.id], { relativeTo: this.activeRoute });
  }
}
