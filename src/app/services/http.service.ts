import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import {
  HistoricalPrice,
  HistoricalPriceResponse,
} from '../types/interfaces/historical-price';
import { SelectedCurrency } from '../types/interfaces/selected-currency';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  constructor(private http: HttpClient) {}

  getListInstruments(): Observable<SelectedCurrency[]> {
    const url = '/api/instruments/v1/instruments/?page=1&size=60';

    return this.http.get(url).pipe(
      map((res: any) => {
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

    return this.http.get(url).pipe(
      map((res: any) => {
        return res.data.map((entry: HistoricalPriceResponse) => ({
          time: entry.t.split('T')[0],
          open: entry.o,
          high: entry.h,
          low: entry.l,
          close: entry.c,
        }));
      })
    );
  }
}
