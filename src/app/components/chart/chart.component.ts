import {Component, inject, OnInit} from '@angular/core';
import {createChart} from "lightweight-charts";
import {CurrencyService} from "../../services/currency.service";
import {HttpService} from "../../services/http.service";
import {HistoricalPrice} from "../../types/interfaces/historical-price";

@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [],
  templateUrl: './chart.component.html',
  styleUrl: './chart.component.scss'
})
export class ChartComponent implements OnInit {
  private readonly httpService = inject(HttpService);
  private readonly currencyService = inject(CurrencyService);

  public chart: any;
  public candlestickSeries: any;
  private candleData!: HistoricalPrice[];

  ngOnInit() {
    this.currencyService.selectedCurrency$.subscribe(currency => this.httpService.getHistoricalPrice(currency.id).subscribe(r => {
      if (r) {
        this.candleData = r;
        this.initChart(this.candleData)
      }
    }))
  }

  private initChart(candleData: HistoricalPrice[]) {
    if (this.chart) {
      this.chart.remove();
    }

    this.chart = createChart('chart', {
      grid: {
        vertLines: {
          color: '#cccccc', style: 1, visible: true
        }, horzLines: {
          color: '#cccccc', style: 1, visible: true
        },
      }, crosshair: {
        mode: 0,
      }, width: 500, height: 400,
    });

    this.candlestickSeries = this.chart.addCandlestickSeries({
      upColor: '#283593',
      downColor: '#e5eaf6',
      borderVisible: true,
      borderColor: '#283593',
      wickUpColor: '#283593',
      wickDownColor: '#283593',
      mouseWheel: true,
    });

    this.candlestickSeries.setData(candleData)

    const firstViewCandleIndex = candleData.length - 30;
    const lastViewCandleIndex = candleData.length - 1;
    this.chart.timeScale().setVisibleRange({
      from: candleData[firstViewCandleIndex].time, to: candleData[lastViewCandleIndex].time,
    });
  }
}
