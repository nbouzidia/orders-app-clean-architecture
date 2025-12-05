import { OrderStatus } from "../enumerations/OrderStatus";

export class OrderCannotBeCanceled extends Error {
  public override readonly name = "OrderCannotBeCanceled";

  public constructor(public readonly status: OrderStatus) {
    super(`Cannot cancel order with status ${status}`);
  }
}
