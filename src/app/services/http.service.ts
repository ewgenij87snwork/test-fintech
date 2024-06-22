import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from "@angular/common/http";
import {map} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  private readonly http = inject(HttpClient)

  getListInstruments() {
    const url = '/api/instruments/v1/instruments/?page=1&size=30';

    return this.http.get(url).pipe(
      map((res: any) => {
       return res.data.map((item: { symbol: any; }) => item.symbol);
      })
    );
  }
}
