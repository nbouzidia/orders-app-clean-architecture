export class OrderLineNotFound extends Error {
  public override readonly name = "OrderLineNotFound";

  public constructor(public readonly orderLineId: string) {
    super(`OrderLine with id ${orderLineId} not found`);
  }
}
