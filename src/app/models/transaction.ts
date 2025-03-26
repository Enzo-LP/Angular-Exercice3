export interface Transaction {
    id: string;
    amount: number;
    balance: number;
    label: string;
    date: string;
  }
  
  export interface TransactionDetail extends Transaction {
    description: string;
  }