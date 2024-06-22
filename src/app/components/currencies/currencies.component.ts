import {Component, inject, OnInit} from '@angular/core';
import {HttpService} from "../../services/http.service";
import {MatFormField} from "@angular/material/form-field";
import {MatOption, MatSelect} from "@angular/material/select";
import {NgForOf, NgIf} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {CurrencyService} from "../../services/currency.service";

@Component({
  selector: 'app-currencies',
  standalone: true,
  imports: [
    MatFormField,
    MatSelect,
    MatOption,
    NgIf,
    FormsModule,
    NgForOf
  ],
  templateUrl: './currencies.component.html',
  styleUrl: './currencies.component.scss'
})
export class CurrenciesComponent implements OnInit {
  private readonly httpService = inject(HttpService);
  private readonly currencyService = inject(CurrencyService);

  public currencies: string[] = [];
  public selectedCurrency = '';

  ngOnInit(): void {
   this.httpService.getListInstruments().subscribe(r => {
     this.currencies = r;
     this.onCurrencySelectionChange(this.currencies[0])
   });
  }

  onCurrencySelectionChange(currency: string) {
    this.selectedCurrency = currency;
    this.currencyService.setSelectedCurrency(this.selectedCurrency);
  }

}
