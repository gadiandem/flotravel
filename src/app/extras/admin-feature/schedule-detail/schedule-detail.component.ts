import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Schedule } from 'src/app/model/thing-to-do/insert-tour/shedule';
import { ExtrasPackage } from 'src/app/model/thing-to-do/insert-tour/extras-package';

import { TourInsertService } from 'src/app/service/extras/tour-insert.service';
import { thingToDoConstant } from '../../thing-to-do.constant';

@Component({
  selector: 'app-schedule-detail',
  templateUrl: './schedule-detail.component.html',
  styleUrls: ['./schedule-detail.component.css']
})
export class ScheduleDetailComponent implements OnInit {

  scheduleId: string;
  scheduleForm: FormGroup;
  formSubmitError: boolean;
  scheduleDetail: Schedule;

  editMode: boolean;
  tourDetail: ExtrasPackage;

  constructor(private activeRoute: ActivatedRoute,
    protected router: Router,
    private fb: FormBuilder,
    private _location: Location,
    private tourDataService: TourInsertService) { }

  ngOnInit() {
    this.activeRoute.params.subscribe((params: Params) => {
      this.scheduleId = params['scheduleId'];
      if(this.scheduleId){
        this.editMode = true;
      } else {
        this.editMode = false;
      }
    });
    this.initForm();
    if(this.scheduleId){
      this.tourDataService.extraDetailIndividual(this.scheduleId).subscribe(
        (res: Schedule) => {
          this.scheduleDetail = res;
          console.log(res);
          this.initFormWithData();
        }
      )
    }
  }
  private initForm() {
    this.scheduleForm = this.fb.group({
      fromTime: [''],
      toTime: [''],
      extraPrice: [''],
      title: [''],
      description: [''],
    });
  }
  private initFormWithData() {
    this.scheduleForm.patchValue({
      fromTime: this.scheduleDetail.fromTime,
      toTime: this.scheduleDetail.toTime,
      extraPrice: this.scheduleDetail.extraPrice,
      title: this.scheduleDetail.title,
      description: this.scheduleDetail.description,
    });
  }

  saveSchedule(){
    console.log(this.scheduleForm.value);
    const tourEdit: ExtrasPackage = JSON.parse(sessionStorage.getItem(thingToDoConstant.TOUR_EDIT))
    const schedule: Schedule = this.scheduleForm.value;
    schedule.id = this.scheduleId;
    schedule.tourId = tourEdit.id;
    if(this.editMode){
      this.tourDataService.extraDetailEdit(this.scheduleForm.value, this.scheduleId).subscribe(
        (res: Schedule) => {
          console.log(res);
          this._location.back();
        }, e => {
          console.log(e);
          this._location.back();
        }
      )
    } else {
      this.tourDetail = JSON.parse(sessionStorage.getItem(thingToDoConstant.TOUR_EDIT));
      const extraDetail: Schedule = this.scheduleForm.value;
      extraDetail.extraPackageId = this.tourDetail.id;
      this.tourDataService.extraDetailAdd(extraDetail).subscribe(
        (res: Schedule) => {
          console.log(res);
          this._location.back();
        }, e => {
          console.log(e);
          this._location.back();
        }
      )
    }
  }
}
