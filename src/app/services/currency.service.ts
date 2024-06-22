import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {
  private selectedCurrencySubject = new BehaviorSubject<string>('');
  selectedCurrency$ = this.selectedCurrencySubject.asObservable();

  setSelectedCurrency(currency: string) {
    this.selectedCurrencySubject.next(currency);
  }
}
