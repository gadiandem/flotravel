import {FieldReq} from '../quote/request/field-req';

export class Service {
  id: string;
  fields: FieldReq[];

  constructor(id: string) {
    this.id = id;
  }
}
