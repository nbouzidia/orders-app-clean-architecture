import { Order } from "../../domain/entities/Order";

export class OrderSaveFailed extends Error {
  public override readonly name = "OrderSaveFailed";

  public constructor(message: string) {
    super(message);
  }
}
