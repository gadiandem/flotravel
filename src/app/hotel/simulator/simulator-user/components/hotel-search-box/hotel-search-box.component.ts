import { DatePipe } from '@angular/common';
import { Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, SimpleChanges, ViewChild} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, Observer, of } from 'rxjs';
import { filter, map, switchMap, tap } from 'rxjs/operators';
import { DestinationRes } from 'src/app/model/dashboard/desRes.model';
import { HotelShoppingReq } from 'src/app/model/dashboard/hotel/hotel-shopping-req';
import { RoomGuest } from 'src/app/model/dashboard/hotel/room-guest';
import { DashboardService } from 'src/app/service/dashboard/dashboard.service';
import { NgbDate, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { Utils } from '../../../../../shared/utils/utils';

@Component({
  selector: 'app-hotel-search-box-simulator',
  templateUrl: './hotel-search-box.component.html',
  styleUrls: ['./hotel-search-box.component.css']
})
export class HotelSearchSimulatorBoxComponent implements OnInit {
  @Output() formValid = new EventEmitter<boolean>();
  @Output() searchHotelBox = new EventEmitter<HotelShoppingReq>();
  @Input() fetching: boolean;
  @Input() searchHotelListRequest: any;
  @ViewChild('menuDrop', {static: false}) menuDrop: ElementRef;
  searchHotelRqCurrent: any;
  showDropDown: boolean;
  showFormSearchResponsive: boolean = false;

  searchForm: FormGroup;
  suggestions$: Observable<DestinationRes[]>;
  search = '';
  errorMessage: string;
  limit: number;
  searching = false;
  searchFailed = false;
  formSubmitError: boolean;

  minDateStart: NgbDateStruct;
  today: Date;
  checkin_date: NgbDateStruct;
  checkout_date: NgbDateStruct;

  roomGuestsNew: RoomGuest[];
  travellerCount: number;
  roomCount: number;
  roomGuests: RoomGuest[];

  destinationName: string;
  cityCode: string;
  destinationDisplayInBoxSearch: string;
  initialForm = false;

  constructor(
    protected dashboardService: DashboardService,
    public datePipe: DatePipe,
    private el: ElementRef,
    private fb: FormBuilder
    ) {}

  ngOnInit() {
    if (!this.initialForm) {
      this.initForm();
      this.initialForm = true;
    }
    this.showDropDown = false;
    this.today = new Date();
    this.minDateStart = { day: this.today.getDate(), month: this.today.getMonth() + 1, year: this.today.getFullYear()};
    this.formSubmitError = false;

    if (this.searchHotelListRequest) {
      this.searchHotelRqCurrent = Object.assign({}, this.searchHotelListRequest);
    }
    this.getDestinationInBox()
    this.refreshData();
    this.searchForm.statusChanges
      .pipe(
        filter(() => this.searchForm.invalid))
      .subscribe(() => this.onFormValid());
    this.searchDestination();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.initialForm) {
      this.initForm();
      this.initialForm = true;
    }
    if (this.searchHotelListRequest) {
      this.searchHotelRqCurrent = Object.assign({}, this.searchHotelListRequest);
      this.refreshData();
      this.getDestinationInBox()
    }
  }

  getDestinationInBox() {
    if (this.searchHotelRqCurrent.destination.displayName) {
      this.destinationDisplayInBoxSearch = this.searchHotelRqCurrent.destination.displayName;
    } else {
      this.destinationDisplayInBoxSearch = this.searchHotelRqCurrent.destination;
    }
  }

  private initForm() {
    this.searchForm = this.fb.group({
      destination: ['', Validators.required],
      check_in:  ['', Validators.required],
      check_out: ['', Validators.required],
      simulator: [false]
    }, {validator: Utils.dateLessThan('check_in', 'check_out')});
  }

  updateValueForm() {
    const checkin_date_new = this.datePipe.transform(new Date(this.searchHotelRqCurrent.checkinDate), 'd/M/yyyy');
    const checkout_date_new = this.datePipe.transform(new Date(this.searchHotelRqCurrent.checkoutDate), 'd/M/yyyy');
    this.searchForm.patchValue({
      destination: this.destinationDisplayInBoxSearch,
      check_in: checkin_date_new,
      check_out: checkout_date_new
    })
    this.search = this.destinationDisplayInBoxSearch;
    this.searchDestination();
    this.cityCode = this.searchHotelRqCurrent.cityCode;
    this.destinationName = this.destinationDisplayInBoxSearch;
  }

  refreshData() {
    if (this.searchHotelRqCurrent) {
      this.checkin_date = this.convertDateStrToNgbDate(this.searchHotelRqCurrent.checkinDate)
      this.checkout_date = this.convertDateStrToNgbDate(this.searchHotelRqCurrent.checkoutDate)
      this.travellerCount = 0;
      this.roomCount = 0;
      this.roomGuests = this.searchHotelRqCurrent.rooms;
      (this.searchHotelRqCurrent.rooms as Array<any>).forEach((r) => {
        this.travellerCount += +r.adult + +r.children;
        this.roomCount += 1;
      });
    } else {
      this.travellerCount = 1;
      this.roomCount = 1;
    }
    this.updateValueForm();
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
              this.errorMessage = err && err.message || 'Something went wrong';
            })
          );
        }
        return of([]);
      })
    );
  }

  private onFormValid() {
    this.formValid.emit(this.searchForm.valid);
  }

  getCheckinDate(data: NgbDate) {
    this.checkin_date = data;
  }

  getCheckoutDate(data: NgbDate) {
    this.checkout_date = data;
  }

  showFormSearch() {
    const myTag = this.el.nativeElement.querySelector("form");
    this.showFormSearchResponsive = true;
    if (this.showFormSearchResponsive) {
      myTag.classList.remove("hotel-search");
    }
  }

  closeFormSearch() {
    let myTag = this.el.nativeElement.querySelector("form");
    this.showFormSearchResponsive = false;
    if (!this.showFormSearchResponsive) {
      myTag.classList.add("hotel-search");
    }
  }

  toggleDrop(){
    this.showDropDown = !this.showDropDown;
  }

  changeShowDropDown(isShowDropDown: boolean) {
    this.showDropDown = isShowDropDown;
  }

  updateRoomGuests(roomGuestsNew: RoomGuest[]) {
    if (roomGuestsNew) {
      this.travellerCount = 0;
      this.roomCount = 0;
      this.roomGuests = roomGuestsNew;
      (roomGuestsNew as Array<any>).forEach((r) => {
        this.travellerCount += +r.adult + +r.children;
        this.roomCount += 1;
      });
    } else {
      this.travellerCount = 1;
      this.roomCount = 1;
    }
  }

  convertNgbDateToDate(data: NgbDateStruct): Date {
    return new Date(data.year, data.month - 1, data.day);
  }

  @HostListener('window:click', ['$event.target'])
  onClick(btn) {
    if (!this.fetching) {
      const menuDropClick = btn.className  === this.menuDrop.nativeElement.className;
      const dropDown =  btn.closest('app-room-guests');
      if(!menuDropClick && !dropDown){
        this.showDropDown = false;
      }
    }
  }

  addDays(date: Date, days: number): Date {
    date.setDate(date.getDate() + days);
    return date;
  }

  convertDateStrToNgbDate(data: string): NgbDateStruct {
    if (data) {
      let dataDate: Array<string> = data.split('-');
      return {day: +dataDate[2], month: +dataDate[1], year: +dataDate[0]};
    }
    return null;
  }

  select(des: any) {
    this.destinationName = des.displayName;
    this.cityCode = des.id;
  }

  searchHotel() {
    if (this.searchForm.valid) {
      const d: any = this.searchForm.value;
      const searchHotelListData = new HotelShoppingReq();
      searchHotelListData.destination = this.destinationName || this.searchHotelRqCurrent.destination.displayName || this.searchHotelRqCurrent.destination;
      searchHotelListData.cityCode = this.cityCode|| this.searchHotelRqCurrent.cityCode;
      searchHotelListData.checkinDate = this.datePipe.transform(this.convertNgbDateToDate(this.checkin_date)
        || this.searchHotelRqCurrent.checkinDate, 'yyyy-MM-dd');
      searchHotelListData.checkoutDate = this.datePipe.transform(this.convertNgbDateToDate(this.checkout_date)
        || this.searchHotelRqCurrent.checkoutDate, 'yyyy-MM-dd');
      searchHotelListData.rooms = [];
      (this.roomGuests as Array<any>).forEach((r) => {
        const room = new RoomGuest();
        room.adult = +r.adult;
        room.children = +r.children;
        if(+r.children > 0){
          const childAges = [];
          for(let i = 0; i < +r.children;i++){
            childAges.push(10);
          }
          room.childAges = childAges;
        }
        searchHotelListData.rooms.push(room);
      });
      this.searchHotelBox.emit(searchHotelListData);
    } else {
      this.formSubmitError = true;
      return;
    }
  }
}
