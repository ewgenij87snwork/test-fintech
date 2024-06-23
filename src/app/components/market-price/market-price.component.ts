import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {CurrencyService} from "../../services/currency.service";
import {Currency} from "../../types/interfaces/currency";
import {WebSocketService} from "../../services/web-socket.service";
import {MatCard, MatCardContent} from "@angular/material/card";
import {JsonPipe, NgIf} from "@angular/common";
import {UtilsService} from "../../services/utils.service";

@Component({
  selector: 'app-market-price',
  standalone: true,
  imports: [
    MatCard,
    MatCardContent,
    NgIf,
    JsonPipe
  ],
  templateUrl: './market-price.component.html',
  styleUrl: './market-price.component.scss'
})
export class MarketPriceComponent implements OnInit, OnDestroy {
  private readonly currencyService = inject(CurrencyService);
  private readonly webSocketService = inject(WebSocketService);
  private readonly utilsService = inject(UtilsService);

  public currency: Currency = {
    price: 0,
    timestamp: '',
    symbol:  '',
    instrumentId: '',
  };

  ngOnInit() {
    this.currencyService.selectedCurrency$.subscribe(
      selectedCurrency => {
       if (selectedCurrency && selectedCurrency.id.length > 0) {
         this.webSocketService.getData().subscribe(r => {
           if (r.hasOwnProperty('last')) {
             const currencyWSData = r.last

             this.currency = {
               price: currencyWSData.price,
               timestamp: this.utilsService.formatDate(currencyWSData.timestamp),
               instrumentId: currencyWSData.instrumentId,
               symbol: selectedCurrency.symbol
             };
           }
         });
         this.webSocketService.sendData(selectedCurrency.id)
       }
      }
    );
  }

  ngOnDestroy() {
    this.webSocketService.closeConnection();
  }
}
