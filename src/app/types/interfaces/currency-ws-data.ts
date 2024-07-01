export interface WSData {
  last?: {
    price: number;
    timestamp: string;
    volume: number;
    instrumentId: string;
  };
  instrumentId: string;
  kinds: string[];
  type: string;
}

export interface WSSentData {
  instrumentId: string;
  kinds: string[];
  provider: string;
  subscribe: boolean;
  type: string;
}
