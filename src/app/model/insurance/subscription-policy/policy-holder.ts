import { AddressPolicyHolder } from './address-policy-holder';
import { PhonePolicyHolder } from './phone-policy-holder';

export class PolicyHolder {
    title: string;
    firstName: string;
    lastName: string;
    birthDate: string;
    email: string;
    phoneNo: PhonePolicyHolder;
    address: AddressPolicyHolder;
    isPolicyBeneficiary: boolean;
    isPolicyHolder: boolean;
    spokenLanguage: string;
    externalHolderId: string;
}