import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of } from 'rxjs';
import { Transaction, TransactionDetail } from '../models/transaction';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private http = inject(HttpClient);
  private baseUrl = 'assets/data/';

getTransactions(): Observable<Transaction[]> {
  return this.http.get<Transaction[]>(this.baseUrl + 'transactions.json').pipe(
    catchError(error => {
      console.error('ERREUR: Le fichier doit être à:', `${this.baseUrl}transactions.json`);
      console.error('Vérifiez que le fichier existe dans src/assets/data/');
      return of([]);
    })
  );
}

  getTransactionById(id: string): Observable<TransactionDetail> {
    return this.http.get<TransactionDetail>(`${this.baseUrl}${id}.json`);
  }
}