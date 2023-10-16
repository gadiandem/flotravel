import {Component, OnInit} from '@angular/core';
import {BsModalRef, ModalOptions, BsModalService} from 'ngx-bootstrap/modal';
import {FormGroup, FormControl} from '@angular/forms';
import {PaginationInstance} from 'ngx-pagination';
import {DatePipe} from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';

import { TourShoppingRQ } from 'src/app/model/thing-to-do/tour-shopping-req';
import { CurrencyNewRes } from 'src/app/model/dashboard/currency/currency-new-res.model';
import { TourListService } from 'src/app/service/extras/tour-list.service';
import { SearchTourDialogComponent } from '../../search-tour-dialog/search-dialog.component';
import { ExtrasPackage } from 'src/app/model/thing-to-do/insert-tour/extras-package';
import { appConstant } from 'src/app/app.constant';
import { thingToDoConstant } from '../../thing-to-do.constant';

@Component({
  selector: 'app-list-item',
  templateUrl: './list-item.component.html',
  styleUrls: ['./list-item.component.css']
})
export class ListItemComponent implements OnInit {
  bsModalRef: BsModalRef;
  bsConfig: ModalOptions;

  searchTourForm: TourShoppingRQ;
  fetching = false;
  fetchFailed = false;
  errorMes: string;
  currencyModel: CurrencyNewRes[];
  currency: string;

  selectedTour: ExtrasPackage;
  tourList: ExtrasPackage[];
  public config: PaginationInstance = {
    id: 'custom',
    itemsPerPage: 10,
    currentPage: 1
  };
  p = 1;
  adultCount = 1;
  childCount = 0;

  constructor(public datepipe: DatePipe,
              private modalService: BsModalService,
              private activatedRoute: ActivatedRoute,
              private route: Router,
              private tourService: TourListService) {
  }

  ngOnInit() {
    this.bsConfig = new ModalOptions();
    this.currencyModel = JSON.parse(localStorage.getItem(appConstant.CURRENCY));
    this.currency = this.currencyModel.find(e => e.code === 'USD').code;
    this.searchTourForm = JSON.parse(sessionStorage.getItem(thingToDoConstant.SEARCH_TOUR_LIST_REQUEST));
    this.fetchTourList();
  }

  fetchTourList() {
    this.fetching = true;
    this.tourService.extraPackageList(this.searchTourForm).subscribe(
      (res: ExtrasPackage[]) => {
        this.tourList = res;
        this.fetchFailed = false;
        this.fetching = false;
      }, error => {
        this.fetching = false;
        this.fetchFailed = true;
        this.errorMes = error.error.error;
      }
    );
  }

  openModalWithComponent() {
    const initialState = {
      searchData: this.searchTourForm,
      title: 'Modal with component'
    };
    this.bsConfig.initialState = initialState;
    this.bsConfig.class = 'modal-lg';
    this.bsConfig.animated = true;
    this.bsModalRef = this.modalService.show(SearchTourDialogComponent, this.bsConfig);
    this.bsModalRef.content.closeBtnName = 'Close';

    this.bsModalRef.content.event.subscribe(res => {
      this.searchTourForm = res;
      this.fetchTourList();
    });
  }

  editItem(tourId: number) {
    // this.selectedTour = this.tourList.find(t => t.id == tourId);
    // if (this.selectedTour != undefined && this.selectedTour != null) {
    //   sessionStorage.setItem('selectedTour', JSON.stringify(this.selectedTour));
    // }
    this.route.navigate(['../insert', tourId], {relativeTo: this.activatedRoute});
  }
}
