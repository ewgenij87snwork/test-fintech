import { Component } from '@angular/core';
import {ChartDataset, ChartOptions, ChartType} from 'chart.js';
import * as data from '@mock/history.json';
import {BaseChartDirective} from "ng2-charts";

@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [
    BaseChartDirective
  ],
  templateUrl: './chart.component.html',
  styleUrl: './chart.component.scss'
})
export class ChartComponent {
private readonly historyData = data.data;
  public lineChartData: ChartDataset[] = [
    {
      data: [],
      label: 'Historical prices',
      pointRadius: 0,
      borderColor: 'black',
      backgroundColor: 'rgba(255,255,0,0.3)'
    },
  ];
  public lineChartLabels: any[] = [];

  public lineChartOptions: (ChartOptions & { annotation: any }) = {
    responsive: true,
    scales: {
      // @ts-ignore
      xAxes: [{
        type: 'time',
        time: {
          unit: 'day'
        }
      }],
      // @ts-ignore
      yAxes: [{
        ticks: {
          beginAtZero: true
        }
      }]
    },
    annotation: {}
  };

  public lineChartType: ChartType = 'line';

  ngOnInit(): void {
    if (this.historyData) {
      this.lineChartData[0].data = this.historyData.map(entry => entry.o);
      this.lineChartLabels = this.historyData.map(entry =>
        (new Date(entry.t)).toDateString()
      );
    }
  }
}
