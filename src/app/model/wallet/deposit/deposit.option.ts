import { OptionInfo } from './option-info';

export class PaymentOption {
    banks: OptionInfo[];
    cards: OptionInfo[];
    mobiles: OptionInfo[];
    keyinCards: OptionInfo[];
    bitcoins: OptionInfo[];
}
