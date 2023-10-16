export class TicketDocument {
    ticketDocNbr: string;
    type: string;
    numberofBooklets: number;
    dateOfIssue: string;
    timeOfIssue: string;
    ticketingLocation: string;
    couponInfo: any[];
    penaltyReferences: any[];
    reportingType: string;
    primaryDocInd: boolean;
}