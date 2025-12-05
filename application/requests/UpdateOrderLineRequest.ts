export interface UpdateOrderLineRequest {
  readonly orderId: string;
  readonly orderLineId: string;
  readonly quantity: number;
}
