import { Component, OnInit, ViewChild } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { DataBindingDirective, GridDataResult, PageChangeEvent } from "@progress/kendo-angular-grid";
import { process } from "@progress/kendo-data-query";
import { Observable, Observer, of } from "rxjs";
import { map, switchMap, tap } from "rxjs/operators";
import { HotelPackage } from "src/app/model/packages/provider/hotel-package";
import { HotelRoomPackage } from "src/app/model/packages/provider/hotel-room-package";

import { AlertifyService } from "src/app/service/alertify.service";
import { PakageProviderService } from "src/app/service/packages/packages-provider.service";
import {Store} from '@ngrx/store';
import * as fromApp from 'src/app/store/app.reducer';
import * as ProviderPackagesActions from 'src/app/packages/provider/store/provider-packages.actions'
import {providerPackagesConstant} from '../provider-packages.constant';

@Component({
  selector: 'app-hotel-room',
  templateUrl: './hotel-room.component.html',
  styleUrls: ['./hotel-room.component.css']
})
export class HotelRoomComponent implements OnInit {
  @ViewChild(DataBindingDirective, { static: false })
  dataBinding: DataBindingDirective;
  public gridViewData: GridDataResult;
  public gridView: GridDataResult;

  public skip = 0;
  pageSize: number;
  page: number;
  searchForm: FormGroup;

  hotels$: Observable<HotelPackage[]>;
  limit: number;
  searchHotel = "";
  hotelName: string;
  hotelId: string;
  searching = false;
  searchFailed = false;
  errorMessage: string;

  isLoading = false;

  fetching: boolean;
  fetchFailed: boolean;
  errorMes: string;
  initialLoad: boolean = true;

  constructor(
    private router: Router,
    private providerService: PakageProviderService,
    private alertify: AlertifyService,
    private store: Store<fromApp.AppState>
  ) { }

  ngOnInit() {
    this.pageSize = 10;
    this.page = 0;
    this.store.select('providerPackages').subscribe((data) => {
      this.fetching = data.loading;
      this.fetchFailed = data.failure;
      this.errorMes = data.errorMessage;
      if(data.packageHotelRoomListRes){
        this.gridViewData = {
          data:  data.packageHotelRoomListRes.items,
          total: data.packageHotelRoomListRes.totalItems,
        };
        this.gridView = this.gridViewData;
      } else {
        this.gridViewData = null;
        this.gridView = this.gridViewData;
      }
    })
    if (this.initialLoad) {
      this.initialLoad = false;
      // this.getPackageHotelRoomList();
    }
    this.limit = 7;
    this.searchHotels();
    this.initForm();
  }

  private initForm() {
    this.searchForm = new FormGroup({
      hotel: new FormControl("", [Validators.required])
    });
  }
  searchHotels() {
    this.hotels$ = new Observable((observer: Observer<string>) => {
      this.limit = 7;
      observer.next(this.searchHotel);
    }).pipe(
      switchMap((query: string) => {
        if (query) {
          // using github public api to get users by name
          return this.providerService.getPackageHotelListByName(this.searchHotel).pipe(
            map((data: HotelPackage[]) => {
              this.searchFailed = false;
              return data || [];
            }),
            tap(
              () => {
                this.searching = false;
              },
              (err) => {
                // in case of http error
                this.limit = 0;
                this.searchFailed = true;
                this.errorMessage =
                  (err && err.message) || "Something goes wrong";
              }
            )
          );
        }
        return of([]);
      })
    );
  }

  selectHotel(des: any) {
    this.hotelName = des.name;
    this.hotelId = des.id;
  }

  getPackageHotelRoomList() {
    if(this.hotelId){
      this.store.dispatch(new ProviderPackagesActions.GetPackageHotelRoomListStart({packageHotelId: this.hotelId, page: {page: this.page, pageSize: this.pageSize}}));
    } else {
      this.alertify.error(`Hotel need to select before Search Room`);
    }
  }
  public onFilter(inputValue: string): void {
    this.gridView.data = process(this.gridViewData.data, {
      filter: {
        logic: "or",
        filters: [
          {
            field: "type",
            operator: "contains",
            value: inputValue,
          },
          {
            field: "customerInformationPack",
            operator: "contains",
            value: inputValue,
          },
          {
            field: "region",
            operator: "contains",
            value: inputValue,
          },
          {
            field: "price",
            operator: "contains",
            value: inputValue,
          },
        ],
      },
    }).data;

    this.dataBinding.skip = 0;
  }

  public pageChange(event: PageChangeEvent): void {
    this.skip = event.skip;
    this.page = this.skip / this.pageSize;
    this.loadItems();
  }

  private loadItems(): void {
    this.getPackageHotelRoomList();
  }
  createRoom(){
    if(this.hotelId){
      sessionStorage.setItem(providerPackagesConstant.PACKAGE_HOTEL_ID, this.hotelId);
      sessionStorage.setItem(providerPackagesConstant.PACKAGE_HOTEL_NAME, this.hotelName);
      this.router.navigate(['/packagesProvider/hotelRoom/create']);
    } else {
      this.alertify.error(`Hotel need to select before create Room`);
    }
  }

  editRoom(hotelDetail: HotelRoomPackage) {
    this.store.dispatch(new ProviderPackagesActions.GetPackageHotelRoomDetailStart({packageHotelRoomId: hotelDetail.id}));
    sessionStorage.setItem(providerPackagesConstant.PACKAGE_HOTEL_ID, this.hotelId);
    sessionStorage.setItem(providerPackagesConstant.PACKAGE_HOTEL_NAME, this.hotelName);
    this.router.navigate(["/packagesProvider/hotelRoom/edit", hotelDetail.id]);
  }

  remvoveRoom(roomId: string){
    this.alertify.confirm('Are you sure you want to delete this Room?', () => {
      sessionStorage.setItem(providerPackagesConstant.PACKAGE_HOTEL_ID, this.hotelId);
      this.store.dispatch(new ProviderPackagesActions.RemovePackageHotelRoomStart({packageHotelRoomId: roomId}));
    });

  }
}
