export class MerchantModel {
    id: string;
    profileImg?: string;
    merchantAccount: string;
    currency: string;
    generateCard: boolean;
    vcnAgentAccount: string;
    vcnAgentPassword: string;
    apiAccount: string;
    apiPassword: string;
    demo: boolean;
}