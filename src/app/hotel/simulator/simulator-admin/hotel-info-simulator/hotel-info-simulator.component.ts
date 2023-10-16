import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DataBindingDirective, GridDataResult, PageChangeEvent } from '@progress/kendo-angular-grid';
import { process } from '@progress/kendo-data-query';
import { UserDetail } from 'src/app/model/auth/user/user-detail';
import { AlertifyService } from 'src/app/service/alertify.service';
import { PakageProviderService } from 'src/app/service/packages/packages-provider.service';
import { Pageable } from 'src/app/model/common/pagination/pageable';
import { HotelInfoSimulator } from '../../../../model/hotel/simulator/hotel-info-simulator';
import { HotelSimulatorService } from 'src/app/service/hotel/simulator/hotel-simulator.service';

@Component({
  selector: 'app-hotel-info-simulator',
  templateUrl: './hotel-info-simulator.component.html',
  styleUrls: ['./hotel-info-simulator.component.css']
})
export class HotelInfoSimulatorComponent implements OnInit {

  @ViewChild(DataBindingDirective, { static: false }) dataBinding: DataBindingDirective;
  public gridViewData: GridDataResult;
  public gridView: GridDataResult;
  public mySelection: string[] = [];
  public skip = 0;
  pageSize: number;
  page: number;
  user: UserDetail;
  isLoading = false;

  fetching: boolean;
  fetchFailed: boolean;
  errorMes: string;
  initialLoad = true;

  constructor(
    private router: Router,
    private providerService: PakageProviderService,
    private alertify: AlertifyService,
    private hotelSimulatorService: HotelSimulatorService
  ) {}

  ngOnInit() {
    this.fetching = true;
    this.pageSize = 10;
    this.page = 0;
    if (this.initialLoad) {
      this.getHotelInfoSimulatorList();
      this.initialLoad = false;
    }
  }

  getHotelInfoSimulatorList() {
    const pageable = new Pageable();
    pageable.page = this.page;
    pageable.pageSize = this.pageSize;
    this.hotelSimulatorService.getHotelInfoSimulatorList(pageable).subscribe(data => {
        if(data.items && data.items.length > 0){
          this.gridViewData = {
            data:  data.items,
            total: data.totalItems,
          }
          this.gridView = Object.assign({}, this.gridViewData);
        } else {
          this.gridViewData = null;
          this.gridView = Object.assign({}, this.gridViewData);
        }
      this.fetching = false;
    }, error => {
      console.log(error);
      this.fetching = false;
    })
  }

  public onFilter(data: any[], inputValue: string): void {
    this.gridView.data = process(data, {
      // filter: {
      //   logic: 'or',
      //   filters: [
      //     {
      //       field: 'name',
      //       operator: 'contains',
      //       value: inputValue
      //     },
      //     {
      //       field: 'description',
      //       operator: 'contains',
      //       value: inputValue
      //     },
      //     {
      //       field: 'cityName',
      //       operator: 'contains',
      //       value: inputValue
      //     },
      //     {
      //       field: 'region',
      //       operator: 'contains',
      //       value: inputValue
      //     },
      //     {
      //       field: 'dayCount',
      //       operator: 'contains',
      //       value: inputValue
      //     }
      //   ],
      // }
    }).data;
    this.gridView.total = data.length;
    if(this.dataBinding){
      this.dataBinding.skip = 0;
    }
  }

  searchPackage(packageName: string){
    if(packageName){
      this.fetching = true;
      this.providerService.searchPackageInfoByName(packageName).subscribe(
        (res: any[]) => {
          this.fetching = false;
          this.onFilter(res, packageName);
        }, e => {
          console.log(e);
          this.fetching = false;
        }
      )
    } else {
      this.gridView = Object.assign({}, this.gridViewData);
    }
  }

  public pageChange(event: PageChangeEvent): void {
    this.skip = event.skip;
    this.page = this.skip / this.pageSize;
    this.loadItems();
  }

  private loadItems(): void {
    this.getHotelInfoSimulatorList();
  }

  viewDetail(hotelInfo: HotelInfoSimulator) {
    this.router.navigate(['/hotelSimulatorAdmin/hotelInfo/edit', hotelInfo.id]);
    sessionStorage.setItem('hotelInfoSimulatorDetail', JSON.stringify(hotelInfo));
  }

  removeHotelInfoSimulator(hotelInfoSimulatorId: string){
    this.alertify.confirm('Are you sure you want to delete this hotel simulator?', () => {
      this.hotelSimulatorService.deleteHotelInfoSimulator(hotelInfoSimulatorId).subscribe(data => {
        this.alertify.success(`delete hotel successful!`);
      }, error => {
        console.log(error);
        this.alertify.error(`delete hotel fail!`);
      });
      this.getHotelInfoSimulatorList();
    });
  }

  createHotelInfo(){
    this.router.navigate(['/hotelSimulatorAdmin/hotelInfo/create']);
  }

}
