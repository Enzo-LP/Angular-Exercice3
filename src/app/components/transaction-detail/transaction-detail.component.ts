import { Component, OnInit } from '@angular/core';
import { TransactionService } from '../../services/transaction.service';
import { TransactionDetail } from '../../models/transaction';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-transaction-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './transaction-detail.component.html',
  styleUrls: ['./transaction-detail.component.css']
})
export class TransactionDetailComponent implements OnInit {
  transaction: TransactionDetail | null = null;
  isLoading = true;
  error: string | null = null;

  constructor(
    private transactionService: TransactionService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.router.navigate(['/']);
      return;
    }

    this.loadTransaction(id);
  }

  loadTransaction(id: string): void {
    this.isLoading = true;
    this.error = null;

    this.transactionService.getTransactionById(id)
      .pipe(
        catchError(err => {
          this.error = 'Erreur lors du chargement';
          this.isLoading = false;
          return of(null);
        })
      )
      .subscribe(data => {
        this.transaction = data;
        this.isLoading = false;
      });
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
}