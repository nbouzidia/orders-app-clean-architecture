export class OrderNotFound extends Error {
  public override readonly name = "OrderNotFound";

  public constructor(public readonly orderId: string) {
    super(`Order with id ${orderId} not found`);
  }
}
