import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import {
  HistoricalPriceItemResp,
  HistoricalPriceResp,
  ListInstrumentsResp,
} from '../types/interfaces/api-response';
import { HistoricalPrice } from '../types/interfaces/historical-price';
import { SelectedCurrency } from '../types/interfaces/selected-currency';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  constructor(private http: HttpClient) {}

  getListInstruments(): Observable<SelectedCurrency[]> {
    const url = '/api/instruments/v1/instruments/?page=1&size=60';

    return this.http.get<ListInstrumentsResp>(url).pipe(
      map((res: ListInstrumentsResp) => {
        return res.data
          .filter(
            (item: SelectedCurrency) => item.mappings?.simulation !== undefined
          )
          .map((item: SelectedCurrency) => ({
            symbol: item.symbol,
            id: item.id,
          }));
      })
    );
  }

  getHistoricalPrice(instrumentId: string): Observable<HistoricalPrice[]> {
    const now = new Date().toISOString();
    const url = `/api/bars/v1/bars/count-back?instrumentId=${instrumentId}&barsCount=500&interval=1&periodicity=day&date=${now}&provider=simulation`;

    return this.http.get<HistoricalPriceResp>(url).pipe(
      map((res: HistoricalPriceResp) => {
        return res.data.map((item: HistoricalPriceItemResp) => ({
          time: item.t.split('T')[0],
          open: item.o,
          high: item.h,
          low: item.l,
          close: item.c,
        }));
      })
    );
  }
}
