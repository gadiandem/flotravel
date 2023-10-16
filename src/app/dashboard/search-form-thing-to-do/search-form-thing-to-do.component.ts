import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { Store } from '@ngrx/store';
import { filter, tap, switchMap, map } from 'rxjs/operators';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable, of, Observer } from 'rxjs';

import { TourShoppingRQ } from '../../model/thing-to-do/tour-shopping-req';
import * as TourActions from '../../extras/store/thing-to-do.actions';
import * as fromApp from '../../store/app.reducer';
import { thingToDoConstant } from '../../extras/thing-to-do.constant';
import { DestinationRes } from 'src/app/model/dashboard/desRes.model';
import { DashboardService } from 'src/app/service/dashboard/dashboard.service';
@Component({
  selector: 'app-search-form-thing-to-do',
  templateUrl: './search-form-thing-to-do.component.html',
  styleUrls: ['./search-form-thing-to-do.component.css']
})
export class SearchFormThingToDoComponent implements OnInit {
  // bsConfig: Partial<BsDatepickerConfig>;
  suggestions$: Observable<DestinationRes[]>;
  search = '';
  limit: number;
  errorMessage: string;
  destinationName: string;
  cityCode: string;
  @Output() formValid = new EventEmitter<boolean>();

  formSubmitError: boolean;
  searchTourReq: TourShoppingRQ;
  startTime: Date;
  endTime: Date;
  range = { start: null, end: null };
  searchForm: FormGroup;
  searching = false;
  searchFailed = false;
  constructor(protected router: Router,
    protected dashboardService: DashboardService,
    protected datepipe: DatePipe,
    protected store: Store<fromApp.AppState>) { }

  ngOnInit() {
    sessionStorage.clear();
    this.formSubmitError = false;
    this.startTime = new Date();
    this.endTime = this.addDays(new Date(), 1);
    this.initForm();
    this.searchForm.statusChanges
      .pipe(
        filter(() => this.searchForm.invalid))
      .subscribe(() => this.onFormValid());
    this.searchDestination();
  }
  
  private onFormValid() {
    this.formValid.emit(this.searchForm.valid);
  }
  addDays(date: Date, days: number): Date {
    date.setDate(date.getDate() + days);
    return date;
  }

  private initForm() {
    this.searchForm = new FormGroup({
      destination: new FormControl('', Validators.required),
      checkin_date: new FormControl(this.startTime, Validators.required),
      checkout_date: new FormControl(this.endTime, Validators.required),
    });

  }

  searchDestination() {
    this.suggestions$ = new Observable((observer: Observer<string>) => {
      if (this.search.length > 3) {
        this.limit = 7;
        observer.next(this.search);
      }
    }).pipe(
      switchMap((query: string) => {
        if (query) {
          // using github public api to get users by name
          return this.dashboardService.getDestination(this.search).pipe(
            map((data: DestinationRes[]) => {
              this.searchFailed = false;
              return data || [];
            }),
            tap(() => {
              this.searching = false;
            }, err => {
              // in case of http error
              this.limit = 0;
              this.searchFailed = true;
              this.errorMessage = err && err.message || 'Something goes wrong';
            })
          );
        }
        return of([]);
      })
    );
  }

  select(des: any) {
    this.destinationName = des.displayName;
    this.cityCode = des.id;
  }
  searchTour() {
    if (this.searchForm.valid) {
      const d: any = this.searchForm.value;
      const searchData = new TourShoppingRQ();
      searchData.destination = this.destinationName;
      searchData.startTime = this.datepipe.transform(this.startTime, 'yyyy-MM-dd');
      searchData.endTime = this.datepipe.transform(this.endTime, 'yyyy-MM-dd');
      sessionStorage.setItem(thingToDoConstant.SEARCH_TOUR_LIST_REQUEST, JSON.stringify(searchData));
      this.store.dispatch(new TourActions.SearchTourListStart(
        { data: searchData }));
      this.router.navigate(['/tour']);
    } else {
      this.formSubmitError = true;
      return;
    }
  }
}
