import {Component, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {DataBindingDirective, GridDataResult} from '@progress/kendo-angular-grid';
import {Store} from '@ngrx/store';
import {process} from '@progress/kendo-data-query';
import {BookingList} from 'src/app/model/hotel/hotel-history/booking-list';
import * as fromApp from '../../store/app.reducer';
import {UserDetail} from 'src/app/model/auth/user/user-detail';
import {User} from 'src/app/model/auth/user/user';
import {BookingHotelListUI} from 'src/app/model/hotel/hotel-history/booking-hotel-list.ui';
import {appConstant} from 'src/app/app.constant';
import {AlertifyService} from 'src/app/service/alertify.service';
import {UserService} from 'src/app/service/admin/user/user.service';
import {FormBuilder, FormGroup} from '@angular/forms';
import {DatePipe} from '@angular/common';
import {FlotravelProvider} from '../../model/auth/provider/flotravel-provider';
import {Subscription} from 'rxjs';
import {FlotravelProviderService} from '../../service/admin/provider/flotravel-provider.service';
import {FlotravelBookingSearch} from '../../model/auth/report/flotravel-booking-search';
import {FlotravelBookingService} from '../../service/admin/report/flotravel-booking.service';
import {BsModalRef, BsModalService, ModalOptions} from 'ngx-bootstrap/modal';
import {ReportDetailComponent} from '../dialogs';


@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {
  @ViewChild(DataBindingDirective, { static: false })
  dataBinding: DataBindingDirective;
  gridData: any[];
  gridView: GridDataResult;
  skip = 0;
  currentPage = 0;
  pageSize = 10;
// public gridData: Booking[];
  subscription: Subscription;
  public userBooking: BookingHotelListUI[];
  public agentBookingList: BookingList[];
  public mySelection: string[] = [];
  searchForm: FormGroup;
  formSubmitError: boolean;
  providers: FlotravelProvider[];
  sourceProviders: FlotravelProvider[];
  maxDateStart: Date = new Date();
  fromDateInit: Date;
  toDateInit: Date;
  user: UserDetail;
  selectedUser: User;
  bookings: BookingList[];
  isLoading = false;
  bsModalRef: BsModalRef;
  bsConfig: ModalOptions;
  constructor(private flotravelBookingService: FlotravelBookingService,
              private router: Router,
              private fb: FormBuilder,
              private userManage: UserService,
              private alertify: AlertifyService,
              private providerService: FlotravelProviderService,
              private store: Store<fromApp.AppState>,
              private modalService: BsModalService,
              private datePipe: DatePipe) {
  }

  public ngOnInit(): void {
    this.formSubmitError = false;
    this.sourceProviders = [];
    this.providers = [];
    this.bsConfig = new ModalOptions();
    this.toDateInit = this.addDays(new Date(), 1);
    this.fromDateInit = this.minusMonths(new Date(), 1);
    // this.gridView = this.gridData;
    this.isLoading = true;
    this.initForm();
    this.store.select('auth').subscribe(data => {
      this.user = data.user;
      if (this.user == null) {
        this.user = JSON.parse(localStorage.getItem(appConstant.ACCOUNT_INFO));
        if (this.user == null) {
          this.router.navigate(['/']);
        }
      }
      this.fetchProviders();
      this.getFlotravelBookingList();
    });
  }
  minusMonths(date: Date, months: number): Date {
    date.setDate(date.getDate() - months * 30);
    return date;
  }
  addDays(date: Date, days: number): Date {
    date.setDate(date.getDate() + days);
    return date;
  }
  fetchProviders() {
    this.subscription = this.providerService.getProviders(this.user.id).subscribe(
      (res: FlotravelProvider[]) => {
        // this.providers = res;
        this.sourceProviders = res;
      }
    );
  }
  onChangeCheckOutDate(e, popup) {
    console.log(e);
    popup.toggle(false);
  }
  onChangeProvider(type: string) {
    if (type) {
      this.providers = this.sourceProviders.filter(item => item.type === type);
    }
  }
  private initForm() {
    this.searchForm = this.fb.group({
      serviceType: [''],
      provider: [''],
      fromDate: [this.fromDateInit],
      toDate: [this.toDateInit],
    });
  }
  pageChange(event: any): void {
    this.skip = event.skip;
    const page = this.skip / this.pageSize;
    this.currentPage = page;
    this.getFlotravelBookingList();
  }
  getFlotravelBookingList(keyword = '') {
    const d: any = this.searchForm.value;
    const startDate = this.datePipe.transform(d.fromDate || this.fromDateInit, 'yyyy-MM-dd');
    const toDate = this.datePipe.transform(d.toDate || this.toDateInit, 'yyyy-MM-dd');
    const searchData = new FlotravelBookingSearch();
    searchData.keyword = keyword;
    searchData.serviceName = d.serviceType;
    searchData.provider = d.provider;
    searchData.startDate = startDate;
    searchData.endDate = toDate;
    console.log(searchData);
    this.flotravelBookingService.searchFlotravelBookings(searchData, this.currentPage, this.pageSize).subscribe(
      (res: any) => {
        this.gridData = res;
        this.gridView = {
          data: res.data,
          total: res.count
        };
        this.isLoading = false;

      }, e => {
        console.log(e);
        this.isLoading = false;
      }
    );
  }
  // viewDetail(bookingDetail: BookingList) {
  //   this.router.navigate(['/transactions/hotel-transactions', bookingDetail.id]);
  //   sessionStorage.setItem(hotelConstant.BOOKING_HISTORY_DETAIL, JSON.stringify(bookingDetail));
  // }
  viewDetail(bookingDetail: BookingList) {
    this.bsConfig.initialState = {
      bookingId: bookingDetail.id,
    };
    this.bsConfig.class = 'modal-xl';
    this.bsConfig.animated = true;
    this.bsModalRef = this.modalService.show(
      ReportDetailComponent,
      this.bsConfig
    );
    this.bsModalRef.content.closeBtnName = 'Close';

  }
  public onFilter(input: Event): void {
    const inputValue = (input.target as HTMLInputElement).value;
    this.getFlotravelBookingList(inputValue);
    this.gridView.data = process(this.gridData, {
      filter: {
        logic: 'or',
        filters: [
          {
            field: 'customer',
            operator: 'contains',
            value: inputValue,
          }
        ],
      },
    }).data;

    this.dataBinding.skip = 0;
  }
  exportExcel(){
    const d: any = this.searchForm.value;
    const startDate = this.datePipe.transform(d.fromDate || this.fromDateInit, 'yyyy-MM-dd');
    const toDate = this.datePipe.transform(d.toDate || this.toDateInit, 'yyyy-MM-dd');
    const searchData = new FlotravelBookingSearch();
    searchData.keyword = '';
    searchData.serviceName = d.serviceType;
    searchData.provider = d.provider;
    searchData.startDate = startDate;
    searchData.endDate = toDate;
    this.flotravelBookingService.exportExcelFlotravelBooking(searchData);
  }
}
