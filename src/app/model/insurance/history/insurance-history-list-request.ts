export class InsuranceHistoryListRequest {
  constructor(public userId: string, public startDate?: string, public endDate?: string) {
  }
}
