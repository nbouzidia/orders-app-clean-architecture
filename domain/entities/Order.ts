import { Entity } from "./Entity";
import { OrderLine } from "./OrderLine";
import { OrderStatus } from "../enumerations/OrderStatus";
import { OrderCannotBeCanceled } from "../errors/OrderCannotBeCanceled";
import { OrderLineCannotBeModified } from "../errors/OrderLineCannotBeModified";
import { OrderMustHaveAtLeastOneOrderLine } from "../errors/OrderMustHaveAtLeastOneOrderLine";
import { InvalidStatusTransition } from "../errors/InvalidStatusTransition";

export class Order implements Entity {
  public constructor(
    public readonly identifier: string,
    public readonly orderLines: OrderLine[],
    public readonly status: OrderStatus,
    public readonly updatedAt: Date,
    public readonly createdAt: Date
  ) {
    if (orderLines.length === 0) {
      throw new OrderMustHaveAtLeastOneOrderLine();
    }
  }

  public get totalAmount(): number {
    return this.orderLines.reduce((sum, line) => sum + line.totalAmount, 0);
  }

  public cancel(): Order | OrderCannotBeCanceled {
    if (
      this.status === OrderStatus.Paid ||
      this.status === OrderStatus.Shipped
    ) {
      return new OrderCannotBeCanceled(this.status);
    }

    return new Order(
      this.identifier,
      this.orderLines,
      OrderStatus.Canceled,
      new Date(),
      this.createdAt
    );
  }

  public updateStatus(newStatus: OrderStatus): Order | InvalidStatusTransition {
    const statusOrder = [
      OrderStatus.Pending,
      OrderStatus.Paid,
      OrderStatus.Shipped,
      OrderStatus.Canceled,
    ];

    const currentIndex = statusOrder.indexOf(this.status);
    const newIndex = statusOrder.indexOf(newStatus);

    if (this.status === OrderStatus.Canceled) {
      return new InvalidStatusTransition(this.status, newStatus);
    }

    if (newStatus !== OrderStatus.Canceled && newIndex <= currentIndex) {
      return new InvalidStatusTransition(this.status, newStatus);
    }

    return new Order(
      this.identifier,
      this.orderLines,
      newStatus,
      new Date(),
      this.createdAt
    );
  }

  public addOrderLine(orderLine: OrderLine): Order | OrderLineCannotBeModified {
    if (
      this.status === OrderStatus.Canceled ||
      this.status === OrderStatus.Shipped
    ) {
      return new OrderLineCannotBeModified(this.status);
    }

    const existingLineIndex = this.orderLines.findIndex(
      (line) => line.productId === orderLine.productId
    );

    let newOrderLines: OrderLine[];

    if (existingLineIndex >= 0) {
      const existingLine = this.orderLines[existingLineIndex];
      const newQuantity = existingLine.quantity + orderLine.quantity;
      const updatedLine = existingLine.updateQuantity(newQuantity);

      if (updatedLine instanceof Error) {
        throw updatedLine;
      }

      newOrderLines = [
        ...this.orderLines.slice(0, existingLineIndex),
        updatedLine,
        ...this.orderLines.slice(existingLineIndex + 1),
      ];
    } else {
      newOrderLines = [...this.orderLines, orderLine];
    }

    return new Order(
      this.identifier,
      newOrderLines,
      this.status,
      new Date(),
      this.createdAt
    );
  }

  public removeOrderLine(
    orderLineId: string
  ): Order | OrderLineCannotBeModified | OrderMustHaveAtLeastOneOrderLine {
    if (
      this.status === OrderStatus.Canceled ||
      this.status === OrderStatus.Shipped
    ) {
      return new OrderLineCannotBeModified(this.status);
    }

    const newOrderLines = this.orderLines.filter(
      (line) => line.identifier !== orderLineId
    );

    if (newOrderLines.length === 0) {
      return new OrderMustHaveAtLeastOneOrderLine();
    }

    return new Order(
      this.identifier,
      newOrderLines,
      this.status,
      new Date(),
      this.createdAt
    );
  }

  public updateOrderLine(
    orderLineId: string,
    newQuantity: number
  ): Order | OrderLineCannotBeModified {
    if (
      this.status === OrderStatus.Canceled ||
      this.status === OrderStatus.Shipped
    ) {
      return new OrderLineCannotBeModified(this.status);
    }

    const lineIndex = this.orderLines.findIndex(
      (line) => line.identifier === orderLineId
    );

    if (lineIndex === -1) {
      throw new Error(`OrderLine with id ${orderLineId} not found`);
    }

    const updatedLine = this.orderLines[lineIndex].updateQuantity(newQuantity);

    if (updatedLine instanceof Error) {
      throw updatedLine;
    }

    const newOrderLines = [
      ...this.orderLines.slice(0, lineIndex),
      updatedLine,
      ...this.orderLines.slice(lineIndex + 1),
    ];

    return new Order(
      this.identifier,
      newOrderLines,
      this.status,
      new Date(),
      this.createdAt
    );
  }
}
