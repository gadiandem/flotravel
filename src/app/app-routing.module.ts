import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {HotelHistoryComponent} from './core/components/hotel-history/hotel-history.component';
import {HelpstarHotelHistoryDetailComponent} from './core/components/hotel-history-detail/hotel-history-detail.component';
import {TourHistoryDetailComponent} from './core/components/tour-history-detail/tour-history-detail.component';
import {TourHistoryComponent} from './core/components/tour-history/tour-history.component';
import {FlightHistoryListComponent} from './core/components/flight-history-list/flight-history-list.component';
import {FlightHistoryDetailComponent} from './core/components/flight-history-detail/flight-history-detail.component';
import {URLNavigatorGuard} from './core/guard/url-navigator.guard';
import {InsuranceBookingHistoryListComponent} from './core/components/insurance-booking-history-list/insurance-booking-history-list.component';
import {
  InsuranceBookingHistoryDetailComponent
} from './core/components/insurance-booking-history-detail/insurance-booking-history-detail.component';
import {InsuranceUpdateComponent} from './insurance/insurance-update/insurance-update.component';
import {TracemeHistoryListComponent} from './core/components/traceme-history-list/traceme-history-list.component';
import {TracemeHistoryDetailComponent} from './core/components/traceme-history-detail/traceme-history-detail.component';
import {TermsAndConditionsComponent} from './shared/component/terms-and-conditions/terms-and-conditions.component';
import {PackageHistoryListComponent} from './core/components/package-history-list/package-history-list.component';
import {PackageHistoryDetailComponent} from './core/components/package-history-detail/package-history-detail.component';
import {PackagePendingUpdateComponent} from './packages/pages/package-pending-update/package-pending-update.component';
import {
  PackageHistoryListComponent as SpecialPackageHistoryListComponent
} from './special-packages/pages/package-history-list/package-history-list.component';
import {
  PackageHistoryDetailComponent as SpecialPackageHistoryDetailComponent
} from './special-packages/pages/package-history-detail/package-history-detail.component';
import {
  PackagePendingUpdateComponent as SpecialPackagePendingUpdateComponent
} from './special-packages/pages/package-pending-update/package-pending-update.component';
import {WalletGuard} from './core/guard/wallet.guard';
import {GcaHistoryListComponent} from './core/components/gca-history-list/gca-history-list.component';
import {GcaHistoryDetailComponent} from './core/components/gca-history-detail/gca-history-detail.component';
import {HistoryDetailComponent} from './core/components/helpstar-history-detail/helpstar-history-detail.component';
import {SettingComponent} from './shared/component/setting/setting.component';
import {RedirectProcessComponent} from './shared/component/redirect-process/redirect-process.component';
import {HelpstarHistoryListComponent} from './core/components/helpstar-history-list/helpstar-history-list.component';
import {EmailTemplateComponent} from './shared/component/email-template/email-template.component';
import {EditFlightProviderComponent} from './shared/component/setting/edit-flight-provider/edit-flight-provider.component';
import { SettingSimulatorComponent } from './shared/component/setting-simulator/setting-simulator.component';
import { HotelHistorySimulatorComponent } from './hotel/simulator/simulator-user/hotel-history-simulator/hotel-history-simulator.component';

const routes: Routes = [
  {path: '', redirectTo: 'auth', pathMatch: 'full'},
  {path: 'redirect', component: RedirectProcessComponent},
  {
    path: 'bank-deposit', loadChildren: () => import('src/app/deposit/deposit.module').then(m => m.DepositModule),
    canActivate: [URLNavigatorGuard]
  },
  // { path: 'dashboard', component: DashboardComponent, canActivate: [URLNavigatorGuard] },
  {path: 'auth', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)},
  {
    path: 'dashboard',
    loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule),
    canActivate: [URLNavigatorGuard]
  },
  { path: 'simulator', component: SettingSimulatorComponent },
  {path: 'hotel/history', component: HotelHistoryComponent, canActivate: [URLNavigatorGuard]},
  {path: 'hotel/history/:bookingId', component: HelpstarHotelHistoryDetailComponent, canActivate: [URLNavigatorGuard]},
  {path: 'flight/history', component: FlightHistoryListComponent, canActivate: [URLNavigatorGuard]},
  {path: 'flight/history/:flightId', component: FlightHistoryDetailComponent, canActivate: [URLNavigatorGuard]},
  {path: 'tour/history', component: TourHistoryComponent, canActivate: [URLNavigatorGuard]},
  {path: 'tour/history/:tourId', component: TourHistoryDetailComponent, canActivate: [URLNavigatorGuard]},
  {path: 'insurance/history', component: InsuranceBookingHistoryListComponent, canActivate: [URLNavigatorGuard]},
  {path: 'insurance/history/:insuranceId', component: InsuranceBookingHistoryDetailComponent, canActivate: [URLNavigatorGuard]},
  {path: 'insurance/history/:insuranceId/update/:policyId', component: InsuranceUpdateComponent, canActivate: [URLNavigatorGuard]},
  {path: 'traceme/history', component: TracemeHistoryListComponent, canActivate: [URLNavigatorGuard]},
  {path: 'traceme/history/:tracemeId', component: TracemeHistoryDetailComponent, canActivate: [URLNavigatorGuard]},
  // { path: 'gca/history', component: GcaHistoryListComponent, canActivate: [URLNavigatorGuard] },
  // { path: 'gca/history/:gcaId', component: GcaHistoryDetailComponent, canActivate: [URLNavigatorGuard] },
  {path: 'packages/history', component: PackageHistoryListComponent, canActivate: [URLNavigatorGuard]},
  {path: 'packages/history/:orderId', component: PackageHistoryDetailComponent, canActivate: [URLNavigatorGuard]},
  {path: 'packages/history/:orderId/update', component: PackagePendingUpdateComponent, canActivate: [URLNavigatorGuard]},

  {path: 'specialPackages/history', component: SpecialPackageHistoryListComponent, canActivate: [URLNavigatorGuard]},
  {path: 'specialPackages/history/:orderId', component: SpecialPackageHistoryDetailComponent, canActivate: [URLNavigatorGuard]},
  {path: 'specialPackages/history/:orderId/update', component: SpecialPackagePendingUpdateComponent, canActivate: [URLNavigatorGuard]},

  {path: 'gca/history', component: GcaHistoryListComponent, canActivate: [URLNavigatorGuard]},
  {path: 'gca/history/:orderId', component: GcaHistoryDetailComponent, canActivate: [URLNavigatorGuard]},

  {path: 'hepstar/history', component: HelpstarHistoryListComponent, canActivate: [URLNavigatorGuard]},
  {path: 'hepstar/history/:orderId', component: HistoryDetailComponent, canActivate: [URLNavigatorGuard]},

  {path: 'setting', component: SettingComponent, canActivate: [URLNavigatorGuard]},
  {path: 'flight/providers/:agentId', component: EditFlightProviderComponent, canActivate: [URLNavigatorGuard]},
  {path: 'admin', loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule), canActivate: [URLNavigatorGuard]},
  { path: 'simulator/hotel/history', component: HotelHistorySimulatorComponent, canActivate: [URLNavigatorGuard] },
  { path: 'simulator/hotel', loadChildren: () => import('./hotel/simulator/simulator-user/hotel-simulator-user.module').then(m => m.HotelSimulatorUserModule) },
  {
    path: 'transactions',
    loadChildren: () => import('./transactions-history/transactions-history.module')
      .then(m => m.TransactionsHistoryModule),
    canActivate: [URLNavigatorGuard]
  },
  {path: 'wallet', loadChildren: () => import('./wallet/wallet.module')
      .then(m => m.WalletModule), canActivate: [URLNavigatorGuard]},
  {path: 'hotel', loadChildren: () => import('./hotel/hotel.module')
      .then(m => m.HotelModule), canActivate: [URLNavigatorGuard]},
  {
    path: 'tour', loadChildren: () => import('./extras/thing-to-do.module').then(m => m.ThingToDoModule),
    canActivate: [URLNavigatorGuard]
  },
  {
    path: 'packages', loadChildren: () => import('./packages/packages.module').then(m => m.PackagesModule),
    canActivate: [URLNavigatorGuard]
  },
  {
    path: 'packagesProvider', loadChildren: () => import('./packages/provider/packages-provider.module')
      .then(m => m.PackagesProviderModule),
    canActivate: [URLNavigatorGuard]
  },
  {
    path: 'specialPackages', loadChildren: () => import('./special-packages/special-packages.module')
      .then(m => m.SpecialPackagesModule),
    canActivate: [URLNavigatorGuard]
  },
  {
    path: 'specialPackagesProvider', loadChildren: () => import('./special-packages/provider/special-packages-provider.module')
      .then(m => m.SpecialPackagesProviderModule),
    canActivate: [URLNavigatorGuard]
  },
  {
    path: 'commission', loadChildren: () => import('./commission-manager/commission-manager.module')
      .then(m => m.CommissionManagerModule),
    canActivate: [URLNavigatorGuard]
  },
  {path: 'flight', loadChildren: () => import('./flight/flight.module').then(m => m.FlightModule), canActivate: [URLNavigatorGuard]},
  {
    path: 'combine', loadChildren: () => import('./combine-booking/combine-booking.module')
      .then(m => m.CombineBookingModule), canActivate: [URLNavigatorGuard]
  },
  {
    path: 'insurance', loadChildren: () => import('./insurance/insurance.module')
      .then(m => m.InsuranceModule),
    canActivate: [URLNavigatorGuard]
  },
  {
    path: 'traceme', loadChildren: () => import('./traceme/traceme.module').then(m => m.TraceMeModule),
    canActivate: [URLNavigatorGuard]
  },
  {
    path: 'gca', loadChildren: () => import('./gca/gca.module').then(m => m.GcaModule),
    canActivate: [URLNavigatorGuard]
  },
  {
    path: 'hepstar', loadChildren: () => import('./hepstar/hepstar.module').then(m => m.HepstarModule),
    canActivate: [URLNavigatorGuard]
  },
  {
    path: 'hotelSimulatorAdmin', loadChildren: () => import('./hotel/simulator/simulator-admin/hotel-simulator-admin.module').then(
      m => m.HotelSimulatorAdminModule)
  },
  {path: 'termsAndCondition', component: TermsAndConditionsComponent},

  {
    path: 'ancillary',
    loadChildren: () => import('./ancillary/ancillary.module').then(m => m.AncillaryModule),
    canActivate: [URLNavigatorGuard]
  },
  {path: 'emailTemplate', component: EmailTemplateComponent, canActivate: [URLNavigatorGuard]},
  {
    path: '**', redirectTo: '', pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
