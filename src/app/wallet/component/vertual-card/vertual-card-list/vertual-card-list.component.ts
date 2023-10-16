import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { Location } from "@angular/common";
import { Store } from '@ngrx/store';

import { ModalOptions, BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { TransactionHistoryModalComponent } from "../../transaction/transaction-history-modal/transaction-history-modal.component";
import * as fromApp from 'src/app/store/app.reducer';
import { VCNInfo } from "src/app/model/wallet/vcn/vcn-info";
import { ListAllCardRes } from "src/app/model/wallet/vcn/vcn-res";

interface Country {
  id?: number;
  name: string;
  flag: string;
  area: number;
  population: number;
}
const COUNTRIES: Country[] = [
  {
    name: 'Russia',
    flag: 'f/f3/Flag_of_Russia.svg',
    area: 17075200,
    population: 146989754
  },
  {
    name: 'France',
    flag: 'c/c3/Flag_of_France.svg',
    area: 640679,
    population: 64979548
  },
  {
    name: 'Germany',
    flag: 'b/ba/Flag_of_Germany.svg',
    area: 357114,
    population: 82114224
  },
  {
    name: 'Portugal',
    flag: '5/5c/Flag_of_Portugal.svg',
    area: 92090,
    population: 10329506
  },
  {
    name: 'Canada',
    flag: 'c/cf/Flag_of_Canada.svg',
    area: 9976140,
    population: 36624199
  },
  {
    name: 'Vietnam',
    flag: '2/21/Flag_of_Vietnam.svg',
    area: 331212,
    population: 95540800
  },
  {
    name: 'Brazil',
    flag: '0/05/Flag_of_Brazil.svg',
    area: 8515767,
    population: 209288278
  },
  {
    name: 'Mexico',
    flag: 'f/fc/Flag_of_Mexico.svg',
    area: 1964375,
    population: 129163276
  },
  {
    name: 'United States',
    flag: 'a/a4/Flag_of_the_United_States.svg',
    area: 9629091,
    population: 324459463
  },
  {
    name: 'India',
    flag: '4/41/Flag_of_India.svg',
    area: 3287263,
    population: 1324171354
  },
  {
    name: 'Indonesia',
    flag: '9/9f/Flag_of_Indonesia.svg',
    area: 1910931,
    population: 263991379
  },
  {
    name: 'Tuvalu',
    flag: '3/38/Flag_of_Tuvalu.svg',
    area: 26,
    population: 11097
  },
  {
    name: 'China',
    flag: 'f/fa/Flag_of_the_People%27s_Republic_of_China.svg',
    area: 9596960,
    population: 1409517397
  }
];


@Component({
  selector: 'app-vertual-card-list',
  templateUrl: './vertual-card-list.component.html',
  styleUrls: ['./vertual-card-list.component.css']
})
export class VertualCardListComponent implements OnInit {
  isCollapsed: boolean;
  formSubmitError: boolean;
  getVertualCardListForm: FormGroup;

  page = 1;
  pageSize = 10;
  collectionSize = 10;
  countries: Country[];

  fetching: boolean;
  fetchFailed: boolean;
  errorMes: string;

  bsConfig: ModalOptions;
  bsModalRef: BsModalRef;

  vcnList: ListAllCardRes;
  vcnListView: VCNInfo[];
  constructor(
    private fb: FormBuilder,
    private route: Router,
    private _location: Location,
    private modalService: BsModalService,
    private activeRoute: ActivatedRoute,
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit() {
    this.isCollapsed = false;
    this.initForm();
    this.bsConfig = new ModalOptions();
    this.store.select('wallet').subscribe(data => {
      this.fetching = data.loading;
      this.fetchFailed = data.failure;
      this.errorMes = data.errorMessage;
      this.vcnList = data.vcnListRes;
      if(this.vcnList && this.vcnList.vcns){
        this.vcnListView = this.vcnList.vcns;
        if(this.vcnListView && this.vcnListView.length > 0){
          this.collectionSize = this.vcnListView.length;
        }
      }
    })

  }

  initForm() {
    this.getVertualCardListForm = this.fb.group({
      page: [1],
      pageSize: [this.pageSize]
    });
  }
  
refreshCountries(event: any) {
  this.page = +event;
  this.vcnListView = this.vcnListView
  .map((vcnItem, i) => ({id: i + 1, ...vcnItem}))
  .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
  }

  cancel() {
    this._location.back();
  }

  addBank() {
    if (this.getVertualCardListForm.valid) {
      // this.route.navigate(["../summary"], { relativeTo: this.activeRoute });
      this._location.back();
    } else {
      this.formSubmitError = true;
      window.scroll(0, 0);
      return;
    }
  }

  openModalWithComponent() {
    const modelCount = this.modalService.getModalsCount();
      // const initialState = {
      //   searchFlightForm: Object.assign({}, null),
      // };
      // this.bsConfig.initialState = initialState;
      this.bsConfig.class = "modal-xl";
      this.bsConfig.animated = true;
      this.bsModalRef = this.modalService.show(
        TransactionHistoryModalComponent,
        this.bsConfig
      );
      this.bsModalRef.content.closeBtnName = "Close";
  
      // this.bsModalRef.content.event.subscribe((res) => {
      //   console.log("detail model" + res);
      // });
    
  }
}
