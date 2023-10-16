import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HotelShoppingReq } from 'src/app/model/dashboard/hotel/hotel-shopping-req';

@Injectable({
  providedIn: "root"
})
export class SearchDataService {
  private _searchForm = new HotelShoppingReq();
  private _searchData = new BehaviorSubject<HotelShoppingReq>(this._searchForm);
  currentSearchData = this._searchData.asObservable();

  constructor() {
  }

  setData(searchForm: HotelShoppingReq) {
      this._searchData.next(searchForm);
  }

}
