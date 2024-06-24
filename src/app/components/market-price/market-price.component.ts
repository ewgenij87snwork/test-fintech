import {Component, DestroyRef, OnDestroy, OnInit} from '@angular/core';
import {CurrencyService} from "../../services/currency.service";
import {Currency} from "../../types/interfaces/currency";
import {WebSocketService} from "../../services/web-socket.service";
import {MatCard, MatCardContent} from "@angular/material/card";
import {AsyncPipe, JsonPipe, NgClass, NgIf, NgStyle} from "@angular/common";
import {UtilsService} from "../../services/utils.service";
import {Subject, switchMap, tap, timer} from "rxjs";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";

@Component({
  selector: 'app-market-price',
  standalone: true,
  imports: [MatCard, MatCardContent, NgIf, JsonPipe, AsyncPipe, NgStyle, NgClass],
  templateUrl: './market-price.component.html',
  styleUrl: './market-price.component.scss'
})
export class MarketPriceComponent implements OnInit, OnDestroy {
  public currency: Currency = {
    price: 0, timestamp: '', symbol: '', instrumentId: '',
  };
  public isTimeout = false;
  public isLoading = false;

  private timeout$ = new Subject<void>();
  private timeoutDuration = 4000;

  constructor(private currencyService: CurrencyService, private webSocketService: WebSocketService, private destroyRef: DestroyRef, private utilsService: UtilsService,) {
  }

  ngOnInit() {
    this.currencyService.selectedCurrency$
      .pipe(switchMap(selectedCurrency => {
        if (selectedCurrency && selectedCurrency.id.length > 0) {
          this.isLoading = true;
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
              this.isLoading = false;

            }
          }));
        }
        return [];
      }), takeUntilDestroyed(this.destroyRef))
      .subscribe();

    this.timeout$
      .pipe(switchMap(() => timer(this.timeoutDuration)), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.currency.symbol = '';
        this.isTimeout = true;
      });
  }

  ngOnDestroy() {
    this.webSocketService.closeConnection();
  }

  private resetTimeout() {
    this.timeout$.next();
    this.isTimeout = false;
  }
}
