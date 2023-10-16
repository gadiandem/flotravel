import { Component, OnInit, ViewChild } from '@angular/core';
import { UserDetail } from 'src/app/model/auth/user/user-detail';
import { ExtraPackageAvailability } from 'src/app/model/thing-to-do/insert-tour/extra-package-availability';
import { process } from '@progress/kendo-data-query';
import { DataBindingDirective } from '@progress/kendo-angular-grid';
import { Store } from '@ngrx/store';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { BsDatepickerConfig } from "ngx-bootstrap/datepicker";

import * as fromApp from '../../../store/app.reducer';
import { appConstant } from 'src/app/app.constant';
import { TourListService } from 'src/app/service/extras/tour-list.service';
import { TourInsertService } from 'src/app/service/extras/tour-insert.service';
import { ExtrasPackage } from 'src/app/model/thing-to-do/insert-tour/extras-package';
import { thingToDoConstant } from '../../thing-to-do.constant';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertifyService } from 'src/app/service/alertify.service';
import { ExtraDetailAvailability } from 'src/app/model/thing-to-do/insert-tour/extra-detail-availability';
import { ExtraPackageAvailabilityRQ } from 'src/app/model/thing-to-do/insert-tour/extra-package-availability-add-request';
@Component({
  selector: 'app-extra-package-availability',
  templateUrl: './extra-package-availability.component.html',
  styleUrls: ['./extra-package-availability.component.css']
})
export class ExtraPackageAvailabilityComponent implements OnInit {
  @ViewChild(DataBindingDirective, { static: false }) dataBinding: DataBindingDirective;
  bsConfig: Partial<BsDatepickerConfig>;
  public gridView: ExtraPackageAvailability[];
  public agentBooking: ExtraPackageAvailability[];
  public mySelection: string[] = [];

  user: UserDetail;
  isLoading = false;
  extraPackageInfo: ExtrasPackage;

  extraPackgeId: string;
  minDate: Date;
  extraPackageAvailabilityForm: FormGroup;
  constructor(private store: Store<fromApp.AppState>,
    private router: Router,
    private fb: FormBuilder,
    private activeRoute: ActivatedRoute,
    private alertify: AlertifyService,
    private tourInsertService: TourInsertService,
    private extraCRUDService: TourInsertService) { }

  ngOnInit() {
    this.initForm();
    this.bsConfig = Object.assign({},
      {
        containerClass: "theme-red",
        dateInputFormat: "DD-MM-YYYY",
        minDate: new Date(),
        showWeekNumbers: false,
      }
    );
    this.extraPackageInfo = JSON.parse(sessionStorage.getItem(thingToDoConstant.TOUR_EDIT));
    if(this.extraPackageInfo){
      this.updateFormData();
    }
    this.store.select('auth').subscribe(data => {
      this.user = data.user;
      if (this.user == null) {
        this.user = JSON.parse(localStorage.getItem(appConstant.ACCOUNT_INFO));
        if (this.user == null) {
          this.router.navigate(['/']);
        }
      }
    });
    this.activeRoute.params.subscribe((params: Params) => {
      this.extraPackgeId = params['extraPackageId'];
      if(this.extraPackgeId){
        this.getExtraPackageAvailability();
      }
    });
    // if (this.user != null) {
    //   this.isLoading = true;
    //   this.extraCRUDService.getExtraPackageAvailability('').subscribe(
    //     (res: ExtraPackageAvailability[]) => {
    //       this.gridView = res;
    //       this.isLoading = false;
    //     }, e => {
    //       console.log(e);
    //       this.isLoading = false;
    //     }
    //   );
    // }
    this.extraPackageInfo = JSON.parse(sessionStorage.getItem(thingToDoConstant.TOUR_EDIT));
  }

  getExtraPackageAvailability(){
    this.extraCRUDService.getExtraPackageAvailability(this.extraPackgeId).subscribe(
      (res: ExtraPackageAvailability[]) => {
        this.gridView = res;
        this.updateMindate(res);
        this.isLoading = false;
      }, e => {
        console.log(e);
        this.isLoading = false;
      }
    );
  }

  private initForm() {
    this.extraPackageAvailabilityForm = this.fb.group({
      // id: [''],
      name: ['',[ Validators.required]],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required]
    });
  }
  updateFormData(){
    this.extraPackageAvailabilityForm.patchValue({
      name: this.extraPackageInfo.name
    });
  }
  updateMindate(data: ExtraPackageAvailability[]){
    const lastItem = data.pop();
    if(lastItem){
      this.minDate = new Date(lastItem.date);
    }
  }
  onValueChange(value: Date): void {
    (this.extraPackageAvailabilityForm.get("startDate") as FormControl).setValue(value);
    // this.minReturnDate = value;
    if(value){
      value.setDate(value.getDate() + 1);
    }
    const returnDate = value;
    this.bsConfig = Object.assign({},{
        containerClass: "theme-red",
        dateInputFormat: "DD-MM-YYYY",
        minDate: returnDate,
        showWeekNumbers: false,
      }
    );
  }
  public onFilter(inputValue: string): void {
    this.gridView = process(this.gridView, {
      filter: {
        logic: 'or',
        filters: [
          {
            field: 'id',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'extraPacakge',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'dateAvailable',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'available',
            operator: 'contains',
            value: inputValue
          }
        ],
      }
    }).data;

    this.dataBinding.skip = 0;
  }
  viewDetail(extraPackageAvailabilityDetail: ExtraPackageAvailability){
    console.log(extraPackageAvailabilityDetail);
    this.router.navigate(['../../extraDetailAvailability', extraPackageAvailabilityDetail.id], {
      relativeTo: this.activeRoute,
    });
  }

  addExtraPackageAvailability(){
    const d: any = this.extraPackageAvailabilityForm.value;
    const addExtraPackageAvailability = new ExtraPackageAvailabilityRQ();
    addExtraPackageAvailability.extraPackageId = this.extraPackgeId;
    addExtraPackageAvailability.fromDate = d.startDate;
    addExtraPackageAvailability.toDate = d.endDate;
    this.tourInsertService.addExtraPackageAvailability(addExtraPackageAvailability).subscribe(
      (t: ExtraDetailAvailability) => {
        console.log(t)
          this.alertify.success('Add extrasPackageAvailability  success!');
          this.getExtraPackageAvailability();
      }, e => {
        this.alertify.error('Insert extrasPackage fail!');
        console.log(e);
      }
    );
  }

  deleteExtraPackageAvailability(){
    this.tourInsertService.deleteExtraPackageAvailability(this.extraPackgeId).subscribe(
      (t: ExtraDetailAvailability) => {
        console.log(t)
          this.alertify.success('Add extrasPackageAvailability  success!');
          this.getExtraPackageAvailability();
      }, e => {
        this.alertify.error('Insert extrasPackage fail!');
        console.log(e);
      }
    );
  }
}
