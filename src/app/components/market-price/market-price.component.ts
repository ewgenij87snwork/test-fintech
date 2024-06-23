import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {CurrencyService} from "../../services/currency.service";
import {Currency} from "../../types/interfaces/currency";
import {WebSocketService} from "../../services/web-socket.service";
import {MatCard, MatCardContent} from "@angular/material/card";
import {AsyncPipe, JsonPipe, NgIf} from "@angular/common";
import {UtilsService} from "../../services/utils.service";
import {Subject, switchMap, takeUntil, tap, timer} from "rxjs";

@Component({
  selector: 'app-market-price',
  standalone: true,
  imports: [MatCard, MatCardContent, NgIf, JsonPipe, AsyncPipe],
  templateUrl: './market-price.component.html',
  styleUrl: './market-price.component.scss'
})
export class MarketPriceComponent implements OnInit, OnDestroy {
  public currency: Currency = {
    price: 0, timestamp: '', symbol: '', instrumentId: '',
  };
  public isTimeout = false;
  private readonly currencyService = inject(CurrencyService);
  private readonly webSocketService = inject(WebSocketService);
  private readonly utilsService = inject(UtilsService);
  private unsubscribe$ = new Subject<void>();
  private timeout$ = new Subject<void>();
  private timeoutDuration = 4000;

  ngOnInit() {
    this.currencyService.selectedCurrency$
      .pipe(takeUntil(this.unsubscribe$), switchMap(selectedCurrency => {
        if (selectedCurrency && selectedCurrency.id.length > 0) {
          this.webSocketService.sendData(selectedCurrency.id);
          this.resetTimeout();

          return this.webSocketService.getData().pipe(tap(data => {
            if (data.hasOwnProperty('last')) {
              this.resetTimeout();
              const currencyWSData = data.last;
              this.currency = {
                price: currencyWSData.price,
                timestamp: this.utilsService.formatDate(currencyWSData.timestamp),
                instrumentId: currencyWSData.instrumentId,
                symbol: selectedCurrency.symbol,
              };
            }
          }));
        }
        return [];
      }))
      .subscribe();

    this.timeout$
      .pipe(switchMap(() => timer(this.timeoutDuration)), takeUntil(this.unsubscribe$))
      .subscribe(() => {
        this.currency.symbol = '';
        this.isTimeout = true;
      });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    this.timeout$.complete();
    this.webSocketService.closeConnection();
  }

  private resetTimeout() {
    this.timeout$.next();
    this.isTimeout = false;
  }
}
