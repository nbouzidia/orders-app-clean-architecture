import { describe, it, expect, beforeEach } from "vitest";
import { AddOrderLine } from "../application/usecases/AddOrderLine";
import { PlaceOrder } from "../application/usecases/PlaceOrder";
import { MemoryOrderRepository } from "../infrastructure/repositories/MemoryOrderRepository";
import { NodeIdentifierGenerator } from "../infrastructure/services/NodeIdentifierGenerator";
import { Order } from "../domain/entities/Order";
import { OrderStatus } from "../domain/enumerations/OrderStatus";
import { OrderLineCannotBeModified } from "../domain/errors/OrderLineCannotBeModified";

describe("AddOrderLine Use Case", () => {
  let addOrderLine: AddOrderLine;
  let placeOrder: PlaceOrder;
  let repository: MemoryOrderRepository;
  let idGenerator: NodeIdentifierGenerator;

  beforeEach(() => {
    repository = new MemoryOrderRepository();
    idGenerator = new NodeIdentifierGenerator();
    addOrderLine = new AddOrderLine(idGenerator, repository);
    placeOrder = new PlaceOrder(idGenerator, repository);
  });

  const createOrder = async (): Promise<string> => {
    await placeOrder.execute({
      orderLines: [
        {
          productId: "PROD-001",
          quantity: 2,
          unitPrice: 49.99,
        },
      ],
    });
    const orders = await repository.findAll();
    return orders[0].identifier;
  };

  it("should add a new order line successfully", async () => {
    const orderId = await createOrder();

    const result = await addOrderLine.execute({
      orderId,
      productId: "PROD-002",
      quantity: 1,
      unitPrice: 29.99,
    });

    expect(result).toBeNull();

    const order = await repository.findById(orderId);
    if (order instanceof Order) {
      expect(order.orderLines).toHaveLength(2);
      expect(order.totalAmount).toBe(129.97);
    }
  });

  it("should update quantity when product already exists", async () => {
    const orderId = await createOrder();

    const result = await addOrderLine.execute({
      orderId,
      productId: "PROD-001",
      quantity: 3,
      unitPrice: 49.99,
    });

    expect(result).toBeNull();

    const order = await repository.findById(orderId);
    if (order instanceof Order) {
      expect(order.orderLines).toHaveLength(1);
      expect(order.orderLines[0].quantity).toBe(5);
      expect(order.totalAmount).toBeCloseTo(249.95, 2);
    }
  });

  it("should fail when order is CANCELED", async () => {
    const orderId = await createOrder();
    const order = await repository.findById(orderId);
    if (order instanceof Order) {
      const canceledOrder = new Order(
        order.identifier,
        order.orderLines,
        OrderStatus.Canceled,
        new Date(),
        order.createdAt
      );
      await repository.update(canceledOrder);
    }

    const result = await addOrderLine.execute({
      orderId,
      productId: "PROD-002",
      quantity: 1,
      unitPrice: 29.99,
    });

    expect(result).toBeInstanceOf(OrderLineCannotBeModified);
  });

  it("should fail when order is SHIPPED", async () => {
    const orderId = await createOrder();
    const order = await repository.findById(orderId);
    if (order instanceof Order) {
      const shippedOrder = new Order(
        order.identifier,
        order.orderLines,
        OrderStatus.Shipped,
        new Date(),
        order.createdAt
      );
      await repository.update(shippedOrder);
    }

    const result = await addOrderLine.execute({
      orderId,
      productId: "PROD-002",
      quantity: 1,
      unitPrice: 29.99,
    });

    expect(result).toBeInstanceOf(OrderLineCannotBeModified);
  });
});
