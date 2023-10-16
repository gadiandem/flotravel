export class LocationTotal {
  value: string;
  currency: string;
  add_hrs_charge: string;
  surcharge: string;
  tenant_discounts: TenantDiscounts[];
  total_tenant_discounts: string;
}

export class TenantDiscounts {
  label: string;
  value: string;
}
