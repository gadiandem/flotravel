import { Component, OnInit, ViewChild } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { DataBindingDirective, GridDataResult, PageChangeEvent } from "@progress/kendo-angular-grid";
import { process } from "@progress/kendo-data-query";
import { Observable, Observer, of } from "rxjs";
import { map, switchMap, tap } from "rxjs/operators";
import { HotelRoomPackage } from "src/app/model/packages/provider/hotel-room-package";
import { AlertifyService } from "src/app/service/alertify.service";
import { PakageProviderService } from "src/app/service/packages/packages-provider.service";
import { Store } from '@ngrx/store';
import * as fromApp from 'src/app/store/app.reducer';
import { HotelInfoSimulator } from '../../../../model/hotel/simulator/hotel-info-simulator';
import { HotelSimulatorService } from 'src/app/service/hotel/simulator/hotel-simulator.service';
import { Pageable } from '../../../../model/common/pagination/pageable';
import { adminHotelSimulatorConstant } from '../hotel-simulator-admin.constant';

@Component({
  selector: 'app-hotel-room-simulator',
  templateUrl: './hotel-room-simulator.component.html',
  styleUrls: ['./hotel-room-simulator.component.css']
})
export class HotelRoomSimulatorComponent implements OnInit {
  @ViewChild(DataBindingDirective, { static: false })
  dataBinding: DataBindingDirective;
  public gridViewData: GridDataResult;
  public gridView: GridDataResult;
  hotelSimulatorSelected: HotelInfoSimulator;

  public skip = 0;
  pageSize: number;
  page: number;
  searchForm: FormGroup;

  hotels$: Observable<HotelInfoSimulator[]>;
  limit: number;
  searchHotel = "";
  hotelName: string;
  hotelId: string;
  searching = false;
  searchFailed = false;
  errorMessage: string;

  isLoading = false;

  constructor(
    private router: Router,
    private providerService: PakageProviderService,
    private alertify: AlertifyService,
    private store: Store<fromApp.AppState>,
    private hotelSimulatorService: HotelSimulatorService
  ) { }

  ngOnInit() {
    this.isLoading = true;
    this.pageSize = 10;
    this.page = 0;
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
          return this.hotelSimulatorService.getHotelSimulatorListByName(this.searchHotel).pipe(
            map((data: HotelInfoSimulator[]) => {
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
    this.hotelSimulatorSelected = des;
  }

  getHotelRoomSimulatorList() {
    if(this.hotelId){
      const pageable = new Pageable();
      pageable.page = this.page;
      pageable.pageSize = this.pageSize;
      this.hotelSimulatorService.getAllHotelRoomByHotel(this.hotelId, pageable).subscribe(result => {
        if(result){
          this.gridViewData = {
            data:  result.items,
            total: result.totalItems,
          };
          this.gridView = this.gridViewData;
        } else {
          this.gridViewData = null;
          this.gridView = this.gridViewData;
        }
        this.isLoading = false;
      }, error => {
        console.log(error);
        this.isLoading = false;
      })
    } else {
      this.alertify.error(`Hotel need to select before Search Room`);
    }
  }
  public onFilter(inputValue: string): void {
    this.gridView.data = process(this.gridViewData.data, {
      // filter: {
      //   logic: "or",
      //   filters: [
          // {
          //   field: "type",
          //   operator: "contains",
          //   value: inputValue,
          // },
          // {
          //   field: "customerInformationPack",
          //   operator: "contains",
          //   value: inputValue,
          // },
          // {
          //   field: "region",
          //   operator: "contains",
          //   value: inputValue,
          // },
          // {
          //   field: "price",
          //   operator: "contains",
          //   value: inputValue,
          // },
      //   ],
      // },
    }).data;

    this.dataBinding.skip = 0;
  }

  public pageChange(event: PageChangeEvent): void {
    this.skip = event.skip;
    this.page = this.skip / this.pageSize;
    this.loadItems();
  }

  private loadItems(): void {
    this.getHotelRoomSimulatorList();
  }

  createRoom(){
    if(this.hotelId){
      sessionStorage.setItem(adminHotelSimulatorConstant.HOTEL_SIMULATOR_ID, this.hotelId);
      sessionStorage.setItem(adminHotelSimulatorConstant.HOTEL_SIMULATOR_NAME, this.hotelName);
      sessionStorage.setItem(adminHotelSimulatorConstant.HOTEL_SIMULATOR_SELECTED, JSON.stringify(this.hotelSimulatorSelected));
      this.router.navigate(['/hotelSimulatorAdmin/hotelRoom/create']);
    } else {
      this.alertify.error(`Hotel need to select before create Room`);
    }
  }

  editRoom(hotelDetail: HotelRoomPackage) {
    sessionStorage.setItem(adminHotelSimulatorConstant.HOTEL_SIMULATOR_ID, this.hotelId);
    sessionStorage.setItem(adminHotelSimulatorConstant.HOTEL_SIMULATOR_NAME, this.hotelName);
    sessionStorage.setItem(adminHotelSimulatorConstant.HOTEL_SIMULATOR_SELECTED, JSON.stringify(this.hotelSimulatorSelected));
    this.router.navigate(["/hotelSimulatorAdmin/hotelRoom/edit", hotelDetail.id]);
  }

  removeRoom(roomId: string){
    this.alertify.confirm('Are you sure you want to delete this Room?', () => {
      sessionStorage.setItem(adminHotelSimulatorConstant.HOTEL_SIMULATOR_ID, this.hotelId);
      this.hotelSimulatorService.deleteHotelRoomSimulator(roomId).subscribe(data => {
        this.alertify.success(`delete room successful!`);
      }, error => {
        console.log(error);
        this.alertify.error(`delete room fail!`);
      })
      this.getHotelRoomSimulatorList();
    });
  }
}
