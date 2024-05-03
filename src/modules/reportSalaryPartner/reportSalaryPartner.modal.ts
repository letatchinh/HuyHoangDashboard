export namespace ReportSalaryPartnerSpace {
    export interface Revenue {
        productId:    string;
        revenueSelf:  number;
        revenueGroup: number;
        billSales:    Bill[];
        billTeams:    Bill[];
      }
      
      export interface Bill {
        billId:       string;
        billItemId:   string;
        codeSequence?: string;
        productId:    string;
        value:        number;
        discount:     number;
      }
}