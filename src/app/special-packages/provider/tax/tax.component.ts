import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DataBindingDirective } from '@progress/kendo-angular-grid';
import { process } from "@progress/kendo-data-query";
import { TaxPackage } from 'src/app/model/packages/provider/tax-package';
import { AlertifyService } from 'src/app/service/alertify.service';

import { PakageProviderService } from 'src/app/service/packages/packages-provider.service';

@Component({
  selector: 'app-tax',
  templateUrl: './tax.component.html',
  styleUrls: ['./tax.component.css']
})
export class TaxComponent implements OnInit {
  @ViewChild(DataBindingDirective, { static: false })
  dataBinding: DataBindingDirective;
  public gridView: TaxPackage[];
  isLoading = false;
  
  constructor(
    private router: Router,
    private providerService: PakageProviderService,
    private alertify: AlertifyService
  ) { }

  ngOnInit() {
    this.getPackageTaxList();
  }
  getPackageTaxList() {
    this.isLoading = true;
    this.providerService.getPackageTaxList().subscribe((res: TaxPackage[]) => {
      this.gridView = res;
      this.isLoading = false;
    }, e => {
      console.log(e);
      this.isLoading = false;
    });
  }
  public onFilter(inputValue: string): void {
    this.gridView = process(this.gridView, {
      filter: {
        logic: "or",
        filters: [
          {
            field: "customer",
            operator: "contains",
            value: inputValue,
          },
          {
            field: "tour",
            operator: "contains",
            value: inputValue,
          },
          {
            field: "time",
            operator: "contains",
            value: inputValue,
          },
        ],
      },
    }).data;

    this.dataBinding.skip = 0;
  }

  editTax(hotelDetail: TaxPackage) {
    this.router.navigate(["/packages/provider/tax/edit", hotelDetail.id]);
    sessionStorage.setItem("hotelPackageDetail", JSON.stringify(hotelDetail));
  }

  remvovePackageTax(taxId: string){
    this.alertify.confirm('Are you sure you want to delete this Tax?', () => {
      this.providerService.removePackageTax(taxId).subscribe(
        (res: any) => {
          this.alertify.success(`Delete Tax succeeful!`);
          this.getPackageTaxList();
        }, e => {
          this.alertify.error(`Detele Tax error!. ${e}`);
        }
      )
    });
    
  }
  createTax(){
    this.router.navigate(['/packages/provider/tax/create']);
  }
}
