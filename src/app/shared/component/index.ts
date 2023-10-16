import { AddOnGcaComponent } from "./add-on/add-on-gca/add-on-gca.component";
import { AddOnInsuranceComponent } from "./add-on/add-on-insurance/add-on-insurance.component";
import { AddOnRefundProtectComponent } from "./add-on/add-on-refund-protect/add-on-refund-protect.component";
import { AddOnSmartDelayComponent } from "./add-on/add-on-smart-delay/add-on-smart-delay.component";
import { AddOnTracemeComponent } from "./add-on/add-on-traceme/add-on-traceme.component";
import { AgencyBookingComponent } from "./agency-booking/agency-booking.component";
import { FlocashAdvertisementComponent } from "./flocash-advertisement/flocash-advertisement.component";
import { FORM } from "./form";

export { AddOnRefundProtectComponent } from "./add-on/add-on-refund-protect/add-on-refund-protect.component";
export { AgencyBookingComponent } from "./agency-booking/agency-booking.component";
export { AddOnTracemeComponent } from "./add-on/add-on-traceme/add-on-traceme.component";
export { AddOnInsuranceComponent } from "./add-on/add-on-insurance/add-on-insurance.component";
export { AddOnGcaComponent } from "./add-on/add-on-gca/add-on-gca.component";
export { AddOnSmartDelayComponent } from "./add-on/add-on-smart-delay/add-on-smart-delay.component";
export { FlocashAdvertisementComponent } from "./flocash-advertisement/flocash-advertisement.component";

export { FORM } from "./form";

export const COMPONENTS = [
    ...FORM,
    AgencyBookingComponent,
    AddOnRefundProtectComponent,
    AddOnTracemeComponent,
    AddOnInsuranceComponent,
    AddOnGcaComponent,
    AddOnSmartDelayComponent,
    FlocashAdvertisementComponent
];
