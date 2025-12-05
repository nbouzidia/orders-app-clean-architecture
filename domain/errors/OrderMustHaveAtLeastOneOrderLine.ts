export class OrderMustHaveAtLeastOneOrderLine extends Error {
  public override readonly name = "OrderMustHaveAtLeastOneOrderLine";

  public constructor() {
    super("An order must have at least one order line");
  }
}
