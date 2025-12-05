import { OrderStatus } from "../enumerations/OrderStatus";

export class InvalidStatusTransition extends Error {
  public override readonly name = "InvalidStatusTransition";

  public constructor(
    public readonly currentStatus: OrderStatus,
    public readonly newStatus: OrderStatus
  ) {
    super(`Cannot transition from ${currentStatus} to ${newStatus}`);
  }
}
