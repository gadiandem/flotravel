import {ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {NgbDate, NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import {Observable, Observer, of} from 'rxjs';
import {DestinationRes} from 'src/app/model/dashboard/desRes.model';
import {PackageShoppingReq} from 'src/app/model/packages/consumer/package-shopping-req';
import {RoomGuest} from 'src/app/model/dashboard/hotel/room-guest';
import {packagesConstant} from 'src/app/packages/packages.constant';
import {DatePipe} from '@angular/common';
import {map, switchMap, tap} from 'rxjs/operators';
import {DashboardService} from 'src/app/service/dashboard/dashboard.service';

@Component({
  selector: 'app-special-package-list-search-box',
  templateUrl: './special-package-list-search-box.component.html',
  styleUrls: ['./special-package-list-search-box.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SpecialPackageListSearchBoxComponent implements OnInit {
  @Input() fetching: boolean;
  @Input() packageShoppingReq: PackageShoppingReq;
  @Input() roomGuests: RoomGuest[];
  @Input() travellerCount: number;
  @Input() roomCount: number;

  @Output() searchRequest = new EventEmitter<PackageShoppingReq>();
  @ViewChild('menuDrop', {static: false}) menuDrop: ElementRef;
  packageShoppingForm: FormGroup;

  showFormSearchResponsive = false;
  suggestions$: Observable<DestinationRes[]>;
  search = '';
  limit = 7;
  searching = false;
  searchFailed = false;
  errorMessage = '';
  destinationName: string;
  cityCode: string;
  formSubmitError: boolean;
  startDate: Date;
  endDate: Date;
  minDateStart: Date;
  showDropDown: boolean;
  minDay = 0;
  maxDay = 100;
  minDate = new Date();
  constructor(private el: ElementRef, public datePipe: DatePipe, protected dashboardService: DashboardService,
    private cdref: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.formSubmitError = false;
    this.initForm();
    this.searchDestination();
  }
  ngAfterContentChecked() {
    this.startDate = new Date(this.packageShoppingReq.date);
    this.cdref.detectChanges();
 }
  closeFormSearch() {
    const myTag = this.el.nativeElement.querySelector('form');
    this.showFormSearchResponsive = false;
    if (!this.showFormSearchResponsive) {
      myTag.classList.add('hotel-search');
    }
  }

  private initForm() {
    this.packageShoppingForm = new FormGroup({
      destination: new FormControl(),
      startDate: new FormControl('', Validators.required),
      endDate: new FormControl('', Validators.required)
    });
  }

  select(des: any) {
    this.destinationName = des.displayName;
    this.cityCode = des.id;
  }

  // getStartDate(data: NgbDate) {
  //   this.startDate = data;
  // }

  // getEndDate(data: NgbDate) {
  //   this.endDate = data;
  // }
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
  shoppingPackage() {
    console.log(JSON.stringify(this.startDate));
    const searchRequest = new PackageShoppingReq();
    const d = this.packageShoppingForm.value;
    searchRequest.destination = this.destinationName;
    searchRequest.cityCode = this.cityCode;
    searchRequest.date = this.datePipe.transform(this.startDate, 'yyyy-MM-dd');
    //searchRequest.endDate = this.datePipe.transform(this.convertNgbDateToDate(this.endDate), 'yyyy-MM-dd');
    this.getDayCount();
    searchRequest.minDay = this.minDay;
    searchRequest.maxDay = this.maxDay;
    sessionStorage.setItem(packagesConstant.PACKAGE_SHOPPING_REQ, JSON.stringify(searchRequest));
    this.searchRequest.emit(searchRequest);
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

  getDayCount() {
    const date1 = new Date(this.startDate.getFullYear(), this.startDate.getMonth() - 1, this.startDate.getDate());
    if(!this.endDate){
      this.endDate = new Date(this.startDate.getFullYear(), this.startDate.getMonth() - 1, this.startDate.getDate() + 1)
    }
    const date2 = new Date(this.endDate.getFullYear(), this.endDate.getMonth() - 1, this.endDate.getDate());
    const days = (date2.getTime() - date1.getTime()) / (1000 * 3600 * 24);
    if (days < 1) {
      this.minDay = 0;
      this.maxDay = 1;
    } else if (days >= 1 && days <= 7) {
      this.minDay = 1;
      this.maxDay = 7;
    } else if (days <= 14 && days >= 8) {
      this.minDay = 8;
      this.maxDay = 14;
    } else if (days <= 21 && days >= 15) {
      this.minDay = 8;
      this.maxDay = 21;
    } else if (days >= 22) {
      this.minDay = 22;
      this.maxDay = 100;
    }
  }
  toggleDrop() {
    this.showDropDown = !this.showDropDown;
  }

  changeShowDropDown(isShowDropDown: boolean) {
    this.showDropDown = isShowDropDown;
  }

  convertStringToNgbDate(dateToConvert: string) :NgbDateStruct {
    const date = new Date(dateToConvert);
    return { day: date.getUTCDay(), month: date.getUTCMonth(), year: date.getUTCFullYear()};

  }
  convertNgbDateToDate(data: NgbDateStruct): Date {
    return new Date(data.year, data.month - 1, data.day);
  }

  onOpenDatepicker(event: any, datepicker){
    datepicker.toggle(true);
  }

  @HostListener('window:click', ['$event.target'])
  onClick(btn) {
    const menuDropClick = btn.className === this.menuDrop.nativeElement.className;
    const dropDown = btn.closest('app-room-guests');
    if (!menuDropClick && !dropDown) {
      this.showDropDown = false;
    }
  }
}
