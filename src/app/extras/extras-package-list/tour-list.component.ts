import { Component, OnInit } from '@angular/core';
import { BsModalRef, ModalOptions, BsModalService } from 'ngx-bootstrap/modal';
import { FormGroup, FormControl } from '@angular/forms';
import { PaginationInstance } from 'ngx-pagination';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { TourShoppingRQ } from 'src/app/model/thing-to-do/tour-shopping-req';
import { SearchTourDialogComponent } from '../search-tour-dialog/search-dialog.component';
import { CurrencyNewRes } from 'src/app/model/dashboard/currency/currency-new-res.model';
import { ExtrasPackage } from 'src/app/model/thing-to-do/insert-tour/extras-package';
import * as fromApp from '../../store/app.reducer';
import * as TourActions from '../store/thing-to-do.actions';
import { appConstant } from 'src/app/app.constant';
import { thingToDoConstant } from '../thing-to-do.constant';
import { AlertifyService } from 'src/app/service/alertify.service';
import { ExtrasShoppingRes } from 'src/app/model/thing-to-do/tour-list/extras-shopping-res';
@Component({
  selector: 'app-tour-list',
  templateUrl: './tour-list.component.html',
  styleUrls: ['./tour-list.component.css']
})
export class TourListComponent implements OnInit {
  bsModalRef: BsModalRef;
  bsConfig: ModalOptions;

  searchTourForm: FormGroup;
  searchTourReq: TourShoppingRQ;
  fetching = false;
  fetchFailed = false;
  errorMes: string;
  currencyModel: CurrencyNewRes[];
  currency: string;

  mapOpen = false;
  selectedTour: ExtrasPackage;
  extraPackageRes: ExtrasShoppingRes;
  tourListView: ExtrasPackage[];
  public config: PaginationInstance = {
    id: 'custom',
    itemsPerPage: 10,
    currentPage: 1
  };
  p = 1;
  adultCount = 1;
  childCount = 0;
  tryFetchTour = true;

  constructor(public datepipe: DatePipe,
    private modalService: BsModalService,
    private activatedRoute: ActivatedRoute,
    private route: Router,
    private store: Store<fromApp.AppState>,
    private alertify: AlertifyService) {
  }

  ngOnInit() {
    this.bsConfig = new ModalOptions();
    this.currencyModel = JSON.parse(localStorage.getItem(appConstant.CURRENCY));
    this.currency = this.currencyModel.find(e => e.code === 'USD').code;
    this.store.select('tourList').subscribe((data) => {
      this.fetching = data.loading;
      this.fetchFailed = data.failure;
      this.errorMes = data.errorMessage;
      this.searchTourReq = data.searchTourReq || JSON.parse(sessionStorage.getItem(thingToDoConstant.SEARCH_TOUR_LIST_REQUEST));
      if (data.searchTourListResult) {
        this.extraPackageRes = data.searchTourListResult;
        this.tourListView = Object.assign([], data.searchTourListResult.extraPackageInfos);
      }
    });
    this.initForm();
    if(!this.fetching && !this.extraPackageRes && this.tryFetchTour){
      this.tryFetchTour = false;
      this.fetchTourList();
    }
    // this.fetchTourList();
  }

  onSortChange(type: string) {
    console.log(type);
    switch (type) {
      case "priceIncrease":
        this.increaseSort(this.tourListView);
        break;
      case "priceDecrease":
        this.decreaseSort(this.tourListView);
        break;
      case "popularity":
        // this.ratingStar.threeStar++;
        this.alertify.warning(`Popularity currently not support`);
        break;
      case "new":
        this.alertify.warning(`Newest currently not support`);
        break;
      case "rating":
        this.alertify.warning(`Rating currently not support`);
        break;
    }
  }
  increaseSort(tourList: ExtrasPackage[]) {
    this.tourListView = tourList.sort((a, b) =>
      a.price > b.price ? 1 : -1
    );
  }

  decreaseSort(tourList: ExtrasPackage[]) {
    this.tourListView = tourList.sort((a, b) =>
      a.price < b.price ? 1 : -1
    );
  }

  // ratingSort(tourList: TourPackage[]) {
  //   this.tourListView = tourList.sort((a, b) =>
  //     a.rate < b.starRating ? 1 : -1
  //   );
  // }

  private initForm() {
    this.searchTourForm = new FormGroup({
      destination: new FormControl(),
      check_in: new FormControl(),
      check_out: new FormControl(),
      people: new FormControl()
    });
  }
  fetchTourList() {
    this.store.dispatch(new TourActions.SearchTourListStart({ data: this.searchTourReq }));
  }

  showMap() {
    this.mapOpen = !this.mapOpen;
  }
  openModalWithComponent() {
    const initialState = {
      searchTourReq: Object.assign({}, this.searchTourReq),
      title: 'Search Tour List'
    };
    this.bsConfig.initialState = initialState;
    this.bsConfig.class = 'modal-lg';
    this.bsConfig.animated = true;
    this.bsModalRef = this.modalService.show(SearchTourDialogComponent, this.bsConfig);
    this.bsModalRef.content.closeBtnName = 'Close';

    this.bsModalRef.content.event.subscribe(res => {
      // this.searchTourForm = res;
      this.searchTourReq = Object.assign({}, res);
      this.fetchTourList();
    });
  }

  gotoDetail(tourId: string) {
    this.selectedTour = this.extraPackageRes.extraPackageInfos.find(t => t.id == tourId);
    sessionStorage.setItem(thingToDoConstant.SELECTED_TOUR, JSON.stringify(this.selectedTour));
    this.store.dispatch(new TourActions.FetchTourDetailStart({ data: this.selectedTour, startDate: this.searchTourReq.startTime, endDate: this.searchTourReq.endTime }));
    this.route.navigate(['../detail', tourId], { relativeTo: this.activatedRoute });
  }
}
