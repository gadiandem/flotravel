import { process } from '@progress/kendo-data-query';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DataBindingDirective } from '@progress/kendo-angular-grid';
import { Store } from '@ngrx/store';
import { InsuranceService } from 'src/app/service/insurance/insurance.service';
import { CountryRes } from 'src/app/model/common/country/country-res';
import { UserDetail } from 'src/app/model/auth/user/user-detail';
import { User } from 'src/app/model/auth/user/user';
import { UserService } from 'src/app/service/admin/user/user.service';
import * as fromApp from 'src/app/store/app.reducer';
import { appConstant } from 'src/app/app.constant';

@Component({
  selector: 'app-available-countries',
  templateUrl: './available-countries.component.html',
  styleUrls: ['./available-countries.component.css']
})
export class AvailableCountriesComponent implements OnInit {
  @ViewChild(DataBindingDirective, { static: false }) dataBinding: DataBindingDirective;
  public gridViewData: CountryRes[];
  public gridView: CountryRes[];
  public mySelection: string[] = [];
  formSubmitError: boolean;
  user: UserDetail;
  selectedUser: User;
  isLoading = false;
  constructor(private router: Router,
    private userManage: UserService,
    private store: Store<fromApp.AppState>,
    private insuranceService: InsuranceService,
   ) { }

  ngOnInit() {

    this.store.select('auth').subscribe(data => {
      this.user = data.user;
      if (this.user == null) {
        this.user = JSON.parse(localStorage.getItem(appConstant.ACCOUNT_INFO));
        if (this.user == null) {
          this.router.navigate(['/']);
        }
      }
    });
    if (this.user != null) {
      this.getCountryList();
    } else {
      sessionStorage.setItem('calbackUrl', '/flight/history');
      this.router.navigate(['../../auth/login']);
    }
  }

  getCountryList(){
    this.isLoading = true;
    this.insuranceService.getInsuranceCountryAvailabilityList().subscribe(
        (res: CountryRes[]) => {
        // console.log('countries: ' + JSON.stringify(res));
          this.gridView = res;
          this.gridViewData = res;
          this.isLoading = false;
        }, e => {
          console.log(e);
          this.isLoading = false;
        }
      );
  }
  


  public onFilter(inputValue: string): void {
    this.gridView = process(this.gridViewData, {
      filter: {
        logic: 'or',
        filters: [
          {
            field: 'code',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'name',
            operator: 'contains',
            value: inputValue
          }
        ],
      }
    }).data;
    this.dataBinding.skip = 0;
  
  }
}
