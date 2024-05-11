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
      export type vouchers= {
          "_id": string,
          "typeVoucher": "PT"|'PC',
          "totalAmount": number,
          "status": "CREATED"| 'CONFIRMED'|'APPROVED'|'REJECT'|'CUSTOMER_CANCEL',
          "codeSequence": string,
      }[]
}