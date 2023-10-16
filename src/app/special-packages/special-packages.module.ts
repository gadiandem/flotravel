import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '../shared/share.module';
import { SpecialPackagesRoutingModule } from './special-packages-routing.module';
import { SpecialPackagesComponent } from './special-packages.component';
import { PAGES } from './pages';
import { COMPONENTS } from './components';
import { DIALOGS } from './dialogs';
// import { PackagePendingUpdateComponent } from './package-pending-update/package-pending-update.component';

@NgModule({
  declarations: [
    ...PAGES,
    ...COMPONENTS,
    ...DIALOGS,
    SpecialPackagesComponent
  ],
  imports: [
    CommonModule,
    // ReactiveFormsModule,
    SpecialPackagesRoutingModule,
    SharedModule
  ],
  exports: [...PAGES, ...COMPONENTS],
  providers: [],
  entryComponents: [...DIALOGS]
})
export class SpecialPackagesModule { }
