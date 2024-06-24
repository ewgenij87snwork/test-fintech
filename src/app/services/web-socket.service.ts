import {Injectable} from '@angular/core';
import {WebSocketSubject} from "rxjs/internal/observable/dom/WebSocketSubject";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private ws$: WebSocketSubject<any>;
  private lastSelectedCurrencyId: string = '';
  private url = 'wss://platform.fintacharts.com/api/streaming/ws/v1/realtime/?token=' + localStorage.getItem('accessToken')

  constructor() {
    this.ws$ = new WebSocketSubject<any>(this.url);
  }

  public sendData(instrumentId: string) {
    if (this.lastSelectedCurrencyId.length > 0 && this.lastSelectedCurrencyId != instrumentId) {
      this.ws$.next(this.createWSObject(this.lastSelectedCurrencyId, false));
    }

    this.lastSelectedCurrencyId = instrumentId;
    this.ws$.next(this.createWSObject(instrumentId));
  }

  public getData(): Observable<any> {
    return this.ws$.asObservable();
  }

  public closeConnection() {
    this.ws$.complete();
  }

  private createWSObject(instrumentId: string, subscribe?: boolean) {
    return {
      instrumentId: instrumentId,
      kinds: ["last"],
      provider: "simulation",
      subscribe: subscribe !== false,
      type: "l1-subscription"
    }
  }
}
