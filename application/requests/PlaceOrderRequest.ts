export interface PlaceOrderRequest {
  readonly orderLines: {
    readonly productId: string;
    readonly quantity: number;
    readonly unitPrice: number;
  }[];
}
