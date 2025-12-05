import { Entity } from "./Entity";
import { InvalidQuantity } from "../errors/InvalidQuantity";

export class OrderLine implements Entity {
  public constructor(
    public readonly identifier: string,
    public readonly productId: string,
    public readonly quantity: number,
    public readonly unitPrice: number,
    public readonly updatedAt: Date,
    public readonly createdAt: Date
  ) {
    if (quantity <= 0) {
      throw new InvalidQuantity(quantity);
    }
  }

  public get totalAmount(): number {
    return this.quantity * this.unitPrice;
  }

  public updateQuantity(newQuantity: number): OrderLine | InvalidQuantity {
    if (newQuantity <= 0) {
      return new InvalidQuantity(newQuantity);
    }

    return new OrderLine(
      this.identifier,
      this.productId,
      newQuantity,
      this.unitPrice,
      new Date(),
      this.createdAt
    );
  }
}
