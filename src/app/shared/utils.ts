import { DatePipe } from '@angular/common';
import { Observable } from 'rxjs';
import { CombineShoppingReq } from '../model/combine/shopping-req';
import { HotelShoppingReq } from '../model/dashboard/hotel/hotel-shopping-req';

export class Utils {
  constructor(private datePipeService: DatePipe) {
  }
  static datePipe: DatePipe;

  private static async preresolve(promises, value, key?: string) {
    if (key === 'callback' || key === 'socket' || key === 'listener') {
      promises.push(value);
      return;
    }
    if (value instanceof Function) {
      this.preresolve(promises, value());
    } else if (value instanceof Array) {
      const inpromises = [];
      value.forEach((v) => {
        this.preresolve(inpromises, v);
      });
      promises.push(Promise.all(inpromises));
    } else if (value instanceof Observable) {
      promises.push(value.toPromise());
    } else if (value instanceof Promise) {
      promises.push(value);
    } else if (value instanceof Object) {
      promises.push(this.resolve(value));
    } else {
      promises.push(value);
    }
  }

  static async resolve(value: Object) {
    const keys = [];
    const promises = [];
    for (const i in value) {
      if (value.hasOwnProperty(i)) {
        keys.push(i);
        this.preresolve(promises, value[i], i);
      }
    }
    const values = await Promise.all(promises);
    const raw = {};
    keys.forEach((key: string, index: number) => {
      raw[key] = values[index];
    });
    return raw;
  }

  static isEmailValid(email: string): boolean {
    // const regex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.+[A-Z]{2,4}$/igm;
    const regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(email);
  }


  static checkLength(text: string, min: number, max: number) {
    if (text && text.length >= min && text.length <= max) {
      return true;
    }
    return false;
  }

  static isNumberPhone(phone: string) {
    const regex = /^[0-9]{4,15}$/igm;
    return regex.test(phone);
  }

  static isNotNull(obj: any): boolean {
    return !this.isNull(obj);
  }

  static isNull(obj: any): boolean {
    return (obj === undefined || obj === null);
  }

  static isFunction(obj: any): boolean {
    return this.isNotNull(obj) && (obj instanceof Function);
  }

  static isNotFunction(obj: any): boolean {
    return !this.isFunction(obj);
  }

  static isStringEmpty(obj: string): boolean {
    return this.isNull(obj) || obj === '' || obj.trim() === '';
  }

  static isStringNotEmpty(obj: string): boolean {
    return !this.isStringEmpty(obj);
  }

  static isArrayEmpty(obj: any[]): boolean {
    return this.isNull(obj) || obj.length === 0;
  }

  static isArrayNotEmpty(obj: any[]): boolean {
    return !Utils.isArrayEmpty(obj);
  }

  static isHtmlNotEmpty(text: string): boolean {
    return !Utils.isHtmlEmpty(text);
  }

  static isHtmlEmpty(text: string): boolean {
    if (Utils.isNull(text)) { return true; }
    text = text.replace(/(<([^>]+)>)/ig, '');
    text = text.trim();
    return Utils.isStringEmpty(text);
  }

  static isEmptyObject(obj: Object): boolean {
    if (Utils.isNull(obj)) { return true; }
    const properties = Object.getOwnPropertyNames(obj);
    return Utils.isArrayEmpty(properties);
  }

  static number(obj: any, defaultValue?: number) {
    if (Utils.isNull(obj) || Utils.isStringEmpty(obj) || isNaN(obj)) { return defaultValue; }
    return Number(obj);
  }

  static cleanUpHtml(html: string): string {
    if (Utils.isNull(html)) { return ''; }
    return html.replace(/<\/*span.*?>/gi, '');
  }


  // format hh:mm:ss DD/MM/YYYY
  static GetFullDateMinuteString(dateVal: Date | undefined | null): string {
    if (dateVal) {
      if (typeof dateVal !== typeof Date) {
        dateVal = new Date(dateVal);
      }

      if (dateVal) {
        // Kết hợp với phần offset vì các hàm GetDate luôn + 7 giờ vào kết quả
        // dateVal.setMinutes(dateVal.getMinutes() + dateVal.getTimezoneOffset());
        // ==> không sử dụng hàm này. Xử lý lệch utc chỉ cần với hàm đẩy date lên api thôi, còn get xuống thì ko cần
        const year = dateVal.getFullYear().toString();

        let month = (dateVal.getMonth() + 1).toString();
        if (month.length < 2) {
          month = '0' + month;
        }

        let day = dateVal.getDate().toString();
        if (day.length < 2) {
          day = '0' + day;
        }

        let hour = dateVal.getHours().toString();
        if (hour.length < 2) {
          hour = '0' + hour;
        }

        let minute = dateVal.getMinutes().toString();
        if (minute.length < 2) {
          minute = '0' + minute;
        }

        let second = dateVal.getSeconds().toString();
        if (second.length < 2) {
          second = '0' + second;
        }

        return hour + ':' + minute + ':' + second + '  ' + day + '/' + month + '/' + year;
      }
    }

    return '';
  }

  static GetDate_YYYY_MM_DD(sourceDate: string): string {
    return this.datePipe.transform(sourceDate, 'yyyy-MM-dd');
  }

  static encodeUnicode(str) {
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
      function toSolidBytes(match, p1) {
        return String.fromCharCode(parseInt('0x' + p1, 16));
      }));
  }

  static decodeUnicode(str) {
    const base64regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
    const validBase64Regex = base64regex.test(str);
    if (validBase64Regex) {
      return decodeURIComponent(atob(str).split('').map((c) => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
    } else {
      return null;
    }
  }

  static combineSearchToHotelSearch(combineSearch: CombineShoppingReq): HotelShoppingReq {
    const hotelSearch = new HotelShoppingReq();
    hotelSearch.metadata = combineSearch.metadata;
    hotelSearch.hotels = combineSearch.hotels;
    hotelSearch.destination = combineSearch.destination.displayName;
    hotelSearch.checkinDate = combineSearch.checkinDate;
    hotelSearch.checkoutDate = combineSearch.checkoutDate;
    return hotelSearch;
  }

  convertDate(passengerList: any[]) {
    passengerList.map(p => {
      p.birthDate  = Utils.datePipe.transform(p.birthDate, 'yyyy-MM-dd');
      if (p.expiryDate) {
        p.expiryDate  = Utils.datePipe.transform(p.expiryDate, 'yyyy-MM-dd');
      }
      if (p.issueDate) {
        p.issueDate  = Utils.datePipe.transform(p.issueDate, 'yyyy-MM-dd');
      }
    });
  }

}
