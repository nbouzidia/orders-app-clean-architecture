import { OrderStatus } from "../enumerations/OrderStatus";

export class OrderLineCannotBeModified extends Error {
  public override readonly name = "OrderLineCannotBeModified";

  public constructor(public readonly status: OrderStatus) {
    super(`Cannot modify order line when order status is ${status}`);
  }
}
