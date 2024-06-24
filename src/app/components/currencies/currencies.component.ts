import { NgForOf, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatFormField } from '@angular/material/form-field';
import { MatOption, MatSelect } from '@angular/material/select';
import { CurrencyService } from '../../services/currency.service';
import { HttpService } from '../../services/http.service';
import { SelectedCurrency } from '../../types/interfaces/selected-currency';

@Component({
  selector: 'app-currencies',
  standalone: true,
  imports: [
    MatFormField,
    MatSelect,
    MatOption,
    NgIf,
    FormsModule,
    NgForOf,
    MatButton,
  ],
  templateUrl: './currencies.component.html',
  styleUrl: './currencies.component.scss',
})
export class CurrenciesComponent implements OnInit {
  public currencies: SelectedCurrency[] = [];
  public selectedCurrency: SelectedCurrency | undefined;

  constructor(
    private httpService: HttpService,
    private currencyService: CurrencyService
  ) {}

  ngOnInit(): void {
    this.httpService.getListInstruments().subscribe(r => {
      this.currencies = r;
      this.onCurrencySelectionChange(this.currencies[0]);
      this.currencyService.setSelectedCurrency(this.currencies[0]);
    });
  }

  onCurrencySelectionChange(currency: SelectedCurrency) {
    this.selectedCurrency = currency;
  }

  onButtonSubscribe() {
    this.selectedCurrency &&
      this.currencyService.setSelectedCurrency(this.selectedCurrency);
  }
}
