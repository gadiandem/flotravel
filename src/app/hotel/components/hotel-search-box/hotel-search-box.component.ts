import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable, Observer, of } from 'rxjs';
import { filter, map, switchMap, tap } from 'rxjs/operators';
import { appConstant } from 'src/app/app.constant';
import { DestinationRes } from 'src/app/model/dashboard/desRes.model';
import { HotelShoppingReq } from 'src/app/model/dashboard/hotel/hotel-shopping-req';
import { RoomGuest } from 'src/app/model/dashboard/hotel/room-guest';
import { DashboardService } from 'src/app/service/dashboard/dashboard.service';
import { hotelConstant } from '../../hotel.constant';

@Component({
  selector: 'app-hotel-search-box',
  templateUrl: './hotel-search-box.component.html',
  styleUrls: ['./hotel-search-box.component.css']
})
export class HotelSearchBoxComponent implements OnInit {
  @Output() formValid = new EventEmitter<boolean>();
  @Output() searchHotelBox = new EventEmitter<HotelShoppingReq>();
  @Input() fetching: boolean;
  @Input() searchHotelListRequest: HotelShoppingReq;
  @ViewChild('menuDrop', {static: false}) menuDrop: ElementRef;

  showDropDown: boolean;
  searchForm: FormGroup;
  suggestions$: Observable<DestinationRes[]>;
  search = '';
  errorMessage: string;
  limit: number;
  searching = false;
  searchFailed = false;
  formSubmitError: boolean;
  destinationName: string;
  cityCode: string;

  // checkin_date: Date;
  // checkout_date: Date;
  numberOfNight = 1;
  travellerCount: number;
  roomCount: number;
  roomGuests: RoomGuest[];
  roomGuestsNew: RoomGuest[];

  minDateStart: Date = new Date();
  showFormSearchResponsive = false;

  constructor(
    protected dashboardService: DashboardService,
    private el: ElementRef,
    private cdref: ChangeDetectorRef,
    public datePipe: DatePipe) { }

  ngOnInit() {
    this.initForm();
    this.refeshData();
    this.searchForm.statusChanges
      .pipe(
        filter(() => this.searchForm.invalid))
      .subscribe(() => this.onFormValid());
    this.searchDestination();
  }
  private initForm() {
    this.searchForm = new FormGroup({
      destination: new FormControl(),
      checkIn: new FormControl(),
      checkOut: new FormControl(),
      people: new FormControl(),
    });
  }
  refeshData() {
    console.log('refresh search box');
    if (this.searchHotelListRequest) {
      this.travellerCount = 0;
      this.roomCount = 0;
      (this.searchForm.get('checkIn') as FormControl).patchValue(new Date(this.searchHotelListRequest.checkinDate));
      (this.searchForm.get('checkOut') as FormControl).patchValue(new Date(this.searchHotelListRequest.checkoutDate));
      (this.searchHotelListRequest.rooms as Array<any>).forEach((r) => {
        this.travellerCount += +r.adult + +r.children;
        this.roomCount += 1;
      });
    this.updateRoomGuests(this.searchHotelListRequest.rooms);
    } else {
      this.travellerCount = 1;
      this.roomCount = 1;
    }

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

  private onFormValid() {
    this.formValid.emit(this.searchForm.valid);
  }

  onValueCheckoutChange(value: Date): void {
    (this.searchForm.get('checkOut') as FormControl).setValue(value);
    // this.checkout_date = value;
  }

  toggleDrop() {
    this.showDropDown = !this.showDropDown;
  }

  updateRoomGuests(roomGuestsNew: RoomGuest[]) {
    if (roomGuestsNew) {
      this.travellerCount = 0;
      this.roomCount = 0;
      this.roomGuests = roomGuestsNew;
      this.roomGuestsNew = roomGuestsNew;
      (roomGuestsNew as Array<any>).forEach((r) => {
        this.travellerCount += +r.adult + +r.children;
        this.roomCount += 1;
      });
    } else {
      this.travellerCount = 1;
      this.roomCount = 1;
    }
    // this.roomGuestsNew = roomGuestsNew;
  }

  changeShowDropDown(isShowDropDown: boolean) {
    this.showDropDown = isShowDropDown;
  }

  select(des: any) {
    this.destinationName = des.displayName;
    this.cityCode = des.id;
  }

  onValueChange(value: Date): void {
    (this.searchForm.get('checkIn') as FormControl).setValue(value);
    // this.checkin_date = value;
  }

  closeFormSearch() {
    const myTag = this.el.nativeElement.querySelector('form');
    this.showFormSearchResponsive = false;
    if (!this.showFormSearchResponsive) {
      myTag.classList.add('hotel-search');
    }
  }

  onChangeCheckOutDate(e, popup) {
    console.log(e);
    popup.toggle(false);
  }

  searchHotel() {
    if (this.searchForm.valid) {
      const d: any = this.searchForm.value;
      const searchHoteListData = new HotelShoppingReq();
      searchHoteListData.destination = this.destinationName || this.searchHotelListRequest.destination;
      searchHoteListData.cityCode = this.cityCode || this.searchHotelListRequest.cityCode;
      const demo = JSON.parse(localStorage.getItem(appConstant.DEMO)) || false;
      searchHoteListData.simulator = demo;
      searchHoteListData.rooms = [] || this.searchHotelListRequest.rooms;
      searchHoteListData.checkinDate = this.datePipe.transform(d.checkIn || this.searchHotelListRequest.checkinDate, 'yyyy-MM-dd');
      searchHoteListData.checkoutDate = this.datePipe.transform(d.checkOut  || this.searchHotelListRequest.checkoutDate, 'yyyy-MM-dd');
      (this.roomGuestsNew as Array<any>).forEach((r) => {
        const room = new RoomGuest();
        room.adult = +r.adult;
        room.children = +r.children;
        if (+r.children > 0) {
          const childAges = [];
          for (let i = 0; i < +r.children; i++) {
            childAges.push(10);
          }
          room.childAges = childAges;
        }
        searchHoteListData.rooms.push(room);
      });

      if (d.simulator) {
        sessionStorage.setItem(hotelConstant.DEMO, d.simulator);
      }
      this.searchHotelBox.emit(searchHoteListData);
    } else {
      this.formSubmitError = true;
      return;
    }
  }

  @HostListener('window:click', ['$event.target'])
  onClick(btn) {
    const menuDropClick = btn.className  === this.menuDrop.nativeElement.className;
    const dropDown =  btn.closest('app-room-guests');
    if (!menuDropClick && !dropDown) {
      this.showDropDown = false;
    }
  }
}
