import { SelectedCurrency } from './selected-currency';

export interface ListInstrumentsResp {
  data: SelectedCurrency[];
}

export interface HistoricalPriceResp {
  data: HistoricalPriceItemResp[];
}

export interface HistoricalPriceItemResp {
  t: string;
  o: number;
  h: number;
  l: number;
  c: number;
}
