import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Store } from '@ngrx/store';


import * as fromApp from '../../../store/app.reducer';
import { appConstant } from 'src/app/app.constant';
import { AlertifyService } from 'src/app/service/alertify.service';
import { TourInsertService } from 'src/app/service/extras/tour-insert.service';
import { TourListService } from 'src/app/service/extras/tour-list.service';
import { UserDetail } from 'src/app/model/auth/user/user-detail';
import { ExtrasPackage } from 'src/app/model/thing-to-do/insert-tour/extras-package';
import { ExtraDetailAvailability } from 'src/app/model/thing-to-do/insert-tour/extra-detail-availability';
import { thingToDoConstant } from '../../thing-to-do.constant';
@Component({
  selector: 'app-extra-detail-availability',
  templateUrl: './extra-detail-availability.component.html',
  styleUrls: ['./extra-detail-availability.component.css']
})
export class ExtraDetailAvailabilityComponent implements OnInit {
  extraDetailAvailabilityForm: FormGroup;
  extraDetailAvailabilityId: string;
  
  user: UserDetail;
  isLoading = false;
  extraPackageInfo: ExtrasPackage;
  constructor(private fb: FormBuilder,
    private store: Store<fromApp.AppState>,
    protected router: Router,
    private activeRoute: ActivatedRoute,
    private alertify: AlertifyService,
    private extraCRUDService: TourInsertService) { }

  ngOnInit() {
    this.initForm();
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
      this.extraDetailAvailabilityId = params['extraDetailAvailabilityId'];
    });
    if (this.user != null) {
      this.isLoading = true;
      this.extraCRUDService.getExtraDetailAvailability(this.extraDetailAvailabilityId).subscribe(
        (res: ExtraDetailAvailability) => {
          // this.gridView = res;
          console.log(res);
          this.isLoading = false;
        }, e => {
          console.log(e);
          this.isLoading = false;
        }
      );
    }
    this.extraPackageInfo = JSON.parse(sessionStorage.getItem(thingToDoConstant.TOUR_EDIT));
  }
  private initForm() {
    this.extraDetailAvailabilityForm = this.fb.group({
      id: [''],
      name: ['',[ Validators.required, Validators.minLength(3)]],
      available: ['', Validators.required],
      childSlot: [''],
      adultSlot: ['', Validators.required],
      childSlotSelected: [''],
      adultSlotSelected: ['', Validators.required],
    });
  }
  update(){

  }
}
