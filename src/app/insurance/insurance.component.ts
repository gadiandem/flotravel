import { Component, OnInit } from '@angular/core';
import { CountryRes } from '../model/common/country/country-res';
import { DashboardService } from '../service/dashboard/dashboard.service';
import { appConstant } from '../app.constant';

@Component({
  selector: 'app-insurance',
  templateUrl: './insurance.component.html',
  styleUrls: ['./insurance.component.css']
})
export class InsuranceComponent implements OnInit {

  constructor(private dashboardService: DashboardService,) { }

  ngOnInit() {
  }

  fetchCountries() {
    this.dashboardService.fetchCountries().subscribe(
      (r: CountryRes) => {
        localStorage.setItem(appConstant.COUNTRY, JSON.stringify(r));
      }, e => {
        console.log(e);
      }
    );
  }


}
