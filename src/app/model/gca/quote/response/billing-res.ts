export class BillingRes {
  currency: string;
  add_hrs_charge: string;
  surcharge: string;
  total_booking_cost: string;
  total_discount: number;
  grand_total: string;
  total_paid: string;
  payment_history: [];
  tenant_discounts: TenantDiscount[];
  total_tenant_discounts: string;
}

class TenantDiscount {
  label: string;
  value: string;
}
