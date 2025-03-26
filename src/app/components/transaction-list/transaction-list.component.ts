import { Component } from '@angular/core';
import { Transaction } from '../../models/transaction';
import { Router } from '@angular/router';
import { TransactionService } from '../../services/transaction.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Column {
  key: keyof Transaction;
  label: string;
}

@Component({
  selector: 'app-transaction-list',
  imports: [CommonModule, FormsModule],
  templateUrl: './transaction-list.component.html',
  styleUrl: './transaction-list.component.css'
})
export class TransactionListComponent {
  transactions: Transaction[] = [];
  filteredTransactions: Transaction[] = [];
  sortedColumn: keyof Transaction = 'date';
  sortDirection: 'asc' | 'desc' = 'desc';
  searchTerm: string = '';

  columns: Column[] = [
    { key: 'date', label: 'Date' },
    { key: 'label', label: 'Libellé' },
    { key: 'amount', label: 'Montant' },
    { key: 'balance', label: 'Solde' }
  ];

  constructor(
    private transactionService: TransactionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadTransactions();
  }

  loadTransactions(): void {
    this.transactionService.getTransactions().subscribe({
      next: (data) => {
        this.transactions = data;
        this.filteredTransactions = [...data];
        this.sortTransactions('date');
      },
      error: (err) => console.error('Erreur:', err)
    });
  }

  sortTransactions(column: keyof Transaction): void {
    if (this.sortedColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortedColumn = column;
      this.sortDirection = 'asc';
    }

    this.filteredTransactions.sort((a, b) => {

      // Gestion spéciale pour les dates
      if (column === 'date') {
        const dateA = new Date(a[column]).getTime();
        const dateB = new Date(b[column]).getTime();
        return this.sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
      }

    // Gestion spéciale pour les libellés (ignore la casse et les accents)
    if (column === 'label') {
      const labelA = a[column].toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      const labelB = b[column].toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      return this.sortDirection === 'asc' 
        ? labelA.localeCompare(labelB) 
        : labelB.localeCompare(labelA);
    }

    // Tri standard pour les autres colonnes
    const aValue = a[column];
    const bValue = b[column];
    
    if (aValue < bValue) return this.sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return this.sortDirection === 'asc' ? 1 : -1;
    return 0;
    });
  }

  viewTransaction(id: string): void {
    this.router.navigate(['/transaction', id]);
  }

  onSearchChange(): void {
    if (!this.searchTerm) {
      this.filteredTransactions = [...this.transactions];
      return;
    }

    const term = this.searchTerm.toLowerCase();
    this.filteredTransactions = this.transactions.filter(t =>
      Object.values(t).some(v => 
        String(v).toLowerCase().includes(term)
      )
    );
  }
}
