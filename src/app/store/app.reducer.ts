import { ActionReducerMap } from '@ngrx/store';

import * as fromFlightList from '../flight/store/flight-list.reducer';
import * as fromHotel from '../hotel/store/hotel.reducer';
import * as fromTour from '../extras/store/thing-to-do.reducer';
import * as fromInsurance from '../insurance/store/insurance.reducer';
import * as fromTraceme from '../traceme/store/traceme.reducer';
import * as fromGca from '../gca/store/gca.reducer';
import * as fromHepstar from '../hepstar/store/hepstar.reducer';
import * as fromPackages from '../packages/store/packages.reducer';
import * as fromSpecialPackages from '../special-packages/store/special-packages.reducer';
import * as fromWallet from '../wallet/store/wallet.reducer';
import * as fromAuth from '../auth/store/auth.reducer';
import * as fromProviderPackages from '../packages/provider/store/provider-packages.reducer'
import * as fromSpecialProviderPackages from '../special-packages/provider/store/provider-special-packages.reducer'

export interface AppState {
  flightList: fromFlightList.State;
  hotel: fromHotel.State;
  tourList: fromTour.State;
  insuranceList: fromInsurance.State;
  tracemeList: fromTraceme.State;
  gcaList: fromGca.State;
  hepstarList: fromHepstar.State;
  packagesList: fromPackages.State;
  specialPackagesList: fromSpecialPackages.State;
  wallet: fromWallet.State;
  auth: fromAuth.State;
  providerPackages: fromProviderPackages.State;
  providerSpecialPackages: fromSpecialProviderPackages.State;
}

export const appReducer: ActionReducerMap<AppState> = {
  flightList: fromFlightList.flightListReducer,
  hotel: fromHotel.hotelReducer,
  tourList: fromTour.thingToDoReducer,
  insuranceList: fromInsurance.insuranceReducer,
  tracemeList: fromTraceme.tracemeReducer,
  gcaList: fromGca.gcaReducer,
  hepstarList: fromHepstar.hepstarReducer,
  packagesList: fromPackages.packagesReducer,
  specialPackagesList: fromSpecialPackages.specialPackagesReducer,
  wallet: fromWallet.walletReducer,
  auth: fromAuth.authReducer,
  providerPackages: fromProviderPackages.providerPackagesReducer,
  providerSpecialPackages: fromSpecialProviderPackages.providerSpecialPackagesReducer
};
