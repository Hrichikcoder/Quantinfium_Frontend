export interface TradeManagementData {
  amountPerBuyDollars: string;
  amountPerBuyPercentage: string;
  sellProfitPercentage?: string;
  sellLevel?: string;
}

export interface ActionCardData {
  id: number;
  type: 'BUY' | 'SELL';
  condition: string;
  value: string;
  minValue?: string;
  maxValue?: string;
  tradeManagement: TradeManagementData;
  levels: number | TradeManagementData[];
}