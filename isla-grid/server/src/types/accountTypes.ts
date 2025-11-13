// banking types 



export type Transaction = {
    type: "deposit" | "withdrawal" | "transfer";
    amount: number; // the amount of the transaction
    from: string; // id of the sender. For transfers, this will be the sender's account ID.
    to: string; // id of the recipient. For transfers, this will be the recipient's account ID. 

    date: number; // the date of the transaction
}


export type Account = {
    accountId : string; // id of the account 
    balance: number; // running balance of the account 
    transactions: string[]; // an array of transaction IDs
}



