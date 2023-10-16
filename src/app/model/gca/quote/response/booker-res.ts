import {Email} from '../../common/email';

export class BookerRes {
  id: string;
  name: {
    title: string;
    forename: string;
    surname: string;
  };
  email: string;
  contacts: Contacts;
  tenant_id: string;
}

class Contacts {
  address: {
    streets: any[];
  };

  emails: Email[];
  phones: any[];
}
