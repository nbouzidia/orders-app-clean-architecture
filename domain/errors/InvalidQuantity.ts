export class InvalidQuantity extends Error {
  public override readonly name = "InvalidQuantity";

  public constructor(public readonly quantity: number) {
    super(`Quantity must be greater than 0, got ${quantity}`);
  }
}
