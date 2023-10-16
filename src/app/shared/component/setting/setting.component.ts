import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { DataBindingDirective, GridDataResult, PageChangeEvent } from '@progress/kendo-angular-grid';
import { Store } from '@ngrx/store';
import { process } from '@progress/kendo-data-query';
import { map } from 'rxjs/operators';

import { AgencyService } from 'src/app/service/admin/agency/agency.service';
import { Agent } from 'src/app/model/auth/agency/agency';
import { AlertifyService } from 'src/app/service/alertify.service';
import { UserDetail } from 'src/app/model/auth/user/user-detail';
import * as fromApp from 'src/app/store/app.reducer';
import { adminConstant } from 'src/app/admin/userGroup-constant';
import { appConstant } from 'src/app/app.constant';

import { flightConstant, flightProvider, flightProviderName } from 'src/app/flight/flight.constant';
import { FlightSearchProviderService } from 'src/app/service/setting/flight-search-provider.service';
import { FLightSearchProvidersEnable } from 'src/app/model/common/flight-search-enable/flight-search-enable';
import { FLightProviderSettingRequest } from 'src/app/model/common/flight-search-enable/flight-setting-enable-request';
import { FLightProviderEnable } from 'src/app/model/common/flight-search-enable/flight-enable-item';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.css']
})
export class SettingComponent implements OnInit {
  @ViewChild(DataBindingDirective, { static: true })
  dataBinding: DataBindingDirective;
  gridData: Agent[];
  // gridView: Agent[];
  gridView: GridDataResult;
  skip = 0;
  currentPage = 0;
  pageSize = 10;
  isLoading: boolean;

  agencyCreate: Agent;
  accountInfo: UserDetail;
  settingForm: FormGroup;
  providerSearch: number;
  systemFlightSetting: FLightSearchProvidersEnable[];
  requestSetting: FLightProviderSettingRequest;
  constructor(private _location: Location,
    private alertify: AlertifyService,
    private providerSetting: FlightSearchProviderService,
    private agencyManage: AgencyService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private store: Store<fromApp.AppState>) { }

  ngOnInit() {
    this.initForm();
    this.requestSetting = new FLightProviderSettingRequest();
    this.requestSetting.suppliers = [];
    this.fetchingProviderList();
    this.store
      .select('auth')
      .pipe(map((authState) => authState.user))
      .subscribe((user) => {
        this.accountInfo = user || JSON.parse(localStorage.getItem(appConstant.ACCOUNT_INFO));
        if (this.accountInfo) {
          this.getAgencySettingList();
        }
      });
  }

  private initForm() {
    this.settingForm = new FormGroup({
      // providerSearch: new FormControl(false, Validators.required),
      hahnAir: new FormControl(false, Validators.required),
      aero: new FormControl(false, Validators.required),
      et: new FormControl(false, Validators.required),
      qr: new FormControl(false, Validators.required),
      floAir: new FormControl(false, Validators.required),
    });
  }

  fetchingProviderList() {
    this.providerSetting.fetchFLightSearchProvidersEnable().subscribe(
      res => {
        this.systemFlightSetting = res;
        if (res && res.length > 0) {
          const suppliers: FLightProviderEnable[] = [];
          res.map(s => {
            const supplier = new FLightProviderEnable();
            supplier.supplierId = s.id;
            supplier.searchEnable = s.searchEnable;
            supplier.name = s.name;
            suppliers.push(supplier);
          });
          this.requestSetting.suppliers = suppliers;
          this.updateFormWithData(res);
        }
      }
    );
  }

  updateFormWithData(providers: FLightSearchProvidersEnable[]) {
    providers.forEach(provider => {
        if (provider.name === flightProviderName[flightProviderName.HahnAir]) {
          this.settingForm.patchValue({ hahnAir: provider.searchEnable });
        }
        if (provider.name === flightProviderName[flightProviderName.AeroCRS]) {
          this.settingForm.patchValue({ aero: provider.searchEnable });
        }
        if (provider.name === flightProviderName[flightProviderName.ET]) {
          this.settingForm.patchValue({ et: provider.searchEnable });
        }
        if (provider.name === flightProviderName[flightProviderName.QR]) {
          this.settingForm.patchValue({ qr: provider.searchEnable });
        }
        if (provider.name === flightProviderName[flightProviderName.FloAir]) {
          this.settingForm.patchValue({ floAir: provider.searchEnable });
        }
    });
  }

  saveSetting() {
    const d = this.settingForm.value;

    this.requestSetting.suppliers
      .filter(provider => provider.name === 'HahnAir')
      .map(item => item.searchEnable = d.hahnAir);

    this.requestSetting.suppliers
      .filter(provider => provider.name === 'AeroCRS')
      .map(item => item.searchEnable = d.aero);

    this.requestSetting.suppliers
      .filter(provider => provider.name === 'ET')
      .map(item => item.searchEnable = d.et);


    this.requestSetting.suppliers
      .filter(provider => provider.name === 'QR')
      .map(item => item.searchEnable = d.qr);

    this.requestSetting.suppliers
      .filter(provider => provider.name === 'FloAir')
      .map(item => item.searchEnable = d.floAir);

    this.updateProviderSetting();
  }

  updateProviderSetting() {
    this.providerSetting.enableFLightSearchProviders(this.requestSetting).subscribe(
      res => {
        this.alertify.success('Change Provider successfull!');
        this.getAgencySettingList();
      }, e => {
        this.alertify.error(e);
      }
    );
  }

  getAgencySettingList(searchText?: string) {
    this.isLoading = true;
    this.providerSetting.fetchAgentFLightSettings(this.currentPage, this.pageSize, searchText).subscribe(
      (res: any) => {
          this.gridData = res;
          this.gridView = {
            data: res.data,
            total: res.count
          };
        sessionStorage.setItem('agentList', JSON.stringify(res));
        this.isLoading = false;
      },
      (e) => {
        console.log(e);
        this.isLoading = false;
      }
    );
  }

  pageChange(event: any): void {
    this.skip = event.skip;
    const page = this.skip / this.pageSize;
    this.currentPage = page;
    this.getAgencySettingList();
  }

  editAgency(id: string) {
    this.router.navigate(['/flight/providers', id], { relativeTo: this.activatedRoute });
  }

  onFilter(input: Event): void {
    const inputValue = (input.target as HTMLInputElement).value;
    this.getAgencySettingList(inputValue);
    this.gridView.data = process(this.gridData, {
      filter: {
        logic: 'or',
        filters: [
          {
            field: 'name',
            operator: 'contains',
            value: inputValue,
          }
        ],
      },
    }).data;

    this.dataBinding.skip = 0;
  }
}
