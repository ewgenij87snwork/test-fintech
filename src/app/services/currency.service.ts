import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { SelectedCurrency } from '../types/interfaces/selected-currency';

@Injectable({
  providedIn: 'root',
})
export class CurrencyService {
  private selectedCurrencySubject = new Subject<SelectedCurrency>();

  public selectedCurrency$ = this.selectedCurrencySubject.asObservable();

  setSelectedCurrency(currency: SelectedCurrency) {
    this.selectedCurrencySubject.next(currency);
  }
}
