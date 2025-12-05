import { describe, it, expect, beforeEach } from "vitest";
import { CancelOrder } from "../application/usecases/CancelOrder";
import { PlaceOrder } from "../application/usecases/PlaceOrder";
import { MemoryOrderRepository } from "../infrastructure/repositories/MemoryOrderRepository";
import { NodeIdentifierGenerator } from "../infrastructure/services/NodeIdentifierGenerator";
import { OrderStatus } from "../domain/enumerations/OrderStatus";
import { Order } from "../domain/entities/Order";
import { OrderLine } from "../domain/entities/OrderLine";
import { OrderCannotBeCanceled } from "../domain/errors/OrderCannotBeCanceled";

describe("CancelOrder Use Case", () => {
  let cancelOrder: CancelOrder;
  let placeOrder: PlaceOrder;
  let repository: MemoryOrderRepository;
  let idGenerator: NodeIdentifierGenerator;

  beforeEach(() => {
    repository = new MemoryOrderRepository();
    idGenerator = new NodeIdentifierGenerator();
    cancelOrder = new CancelOrder(repository);
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

  it("should cancel a PENDING order successfully", async () => {
    const orderId = await createOrder();

    const result = await cancelOrder.execute({ orderId });

    expect(result).toBeNull();

    const order = await repository.findById(orderId);
    if (order instanceof Order) {
      expect(order.status).toBe(OrderStatus.Canceled);
    }
  });

  it("should fail to cancel a PAID order", async () => {
    const orderId = await createOrder();
    const order = await repository.findById(orderId);
    if (order instanceof Order) {
      const paidOrder = order.updateStatus(OrderStatus.Paid);
      if (paidOrder instanceof Order) {
        await repository.update(paidOrder);
      }
    }

    const result = await cancelOrder.execute({ orderId });

    expect(result).toBeInstanceOf(OrderCannotBeCanceled);
  });

  it("should fail to cancel a SHIPPED order", async () => {
    const orderId = await createOrder();
    const order = await repository.findById(orderId);
    if (order instanceof Order) {
      const paidOrder = order.updateStatus(OrderStatus.Paid);
      if (paidOrder instanceof Order) {
        const shippedOrder = paidOrder.updateStatus(OrderStatus.Shipped);
        if (shippedOrder instanceof Order) {
          await repository.update(shippedOrder);
        }
      }
    }

    const result = await cancelOrder.execute({ orderId });

    expect(result).toBeInstanceOf(OrderCannotBeCanceled);
  });

  it("should return error when order not found", async () => {
    const result = await cancelOrder.execute({ orderId: "non-existent" });

    expect(result).toBeInstanceOf(Error);
  });
});
