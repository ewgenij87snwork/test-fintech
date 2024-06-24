export interface HistoricalPriceResponse {
  c: number;
  h: number;
  l: number;
  o: number;
  t: string;
  v: number;
}
export interface HistoricalPrice {
  time: string;
  close: number;
  high: number;
  low: number;
  open: number;
}
