import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { WebSocketSubject } from 'rxjs/internal/observable/dom/WebSocketSubject';
import { WSData, WSSentData } from '../types/interfaces/currency-ws-data';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  private ws$!: WebSocketSubject<WSData>;
  private lastSelectedCurrencyId: string = '';

  public createWS() {
    const accessToken = localStorage.getItem('accessToken');

    if (!this.ws$ && accessToken) {
      this.ws$ = new WebSocketSubject(
        'api/streaming/ws/v1/realtime/?token=' + accessToken
      );
    }
  }

  public sendData(instrumentId: string) {
    if (
      this.lastSelectedCurrencyId.length > 0 &&
      this.lastSelectedCurrencyId != instrumentId
    ) {
      this.ws$.next(this.createWSObject(this.lastSelectedCurrencyId, false));
    }

    this.lastSelectedCurrencyId = instrumentId;
    this.ws$.next(this.createWSObject(instrumentId));
  }

  public getData(): Observable<WSData> {
    return this.ws$.asObservable();
  }

  public closeConnection() {
    this.ws$.complete();
  }

  private createWSObject(
    instrumentId: string,
    subscribe?: boolean
  ): WSSentData {
    return {
      instrumentId: instrumentId,
      kinds: ['last'],
      provider: 'simulation',
      subscribe: subscribe !== false,
      type: 'l1-subscription',
    };
  }
}
