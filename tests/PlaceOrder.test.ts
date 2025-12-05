import { describe, it, expect, beforeEach } from "vitest";
import { PlaceOrder } from "../application/usecases/PlaceOrder";
import { MemoryOrderRepository } from "../infrastructure/repositories/MemoryOrderRepository";
import { NodeIdentifierGenerator } from "../infrastructure/services/NodeIdentifierGenerator";
import { PlaceOrderRequest } from "../application/requests/PlaceOrderRequest";

describe("PlaceOrder Use Case", () => {
  let placeOrder: PlaceOrder;
  let repository: MemoryOrderRepository;
  let idGenerator: NodeIdentifierGenerator;

  beforeEach(() => {
    repository = new MemoryOrderRepository();
    idGenerator = new NodeIdentifierGenerator();
    placeOrder = new PlaceOrder(idGenerator, repository);
  });

  it("should create a new order successfully", async () => {
    const request: PlaceOrderRequest = {
      orderLines: [
        {
          productId: "PROD-001",
          quantity: 2,
          unitPrice: 49.99,
        },
      ],
    };

    const result = await placeOrder.execute(request);

    expect(result).toBeNull();

    const orders = await repository.findAll();
    expect(orders).toHaveLength(1);
    expect(orders[0].orderLines).toHaveLength(1);
    expect(orders[0].totalAmount).toBe(99.98);
  });

  it("should create order with multiple lines", async () => {
    const request: PlaceOrderRequest = {
      orderLines: [
        {
          productId: "PROD-001",
          quantity: 2,
          unitPrice: 49.99,
        },
        {
          productId: "PROD-002",
          quantity: 1,
          unitPrice: 29.99,
        },
      ],
    };

    const result = await placeOrder.execute(request);

    expect(result).toBeNull();

    const orders = await repository.findAll();
    expect(orders).toHaveLength(1);
    expect(orders[0].orderLines).toHaveLength(2);
    expect(orders[0].totalAmount).toBe(129.97);
  });

  it("should create order with PENDING status", async () => {
    const request: PlaceOrderRequest = {
      orderLines: [
        {
          productId: "PROD-001",
          quantity: 1,
          unitPrice: 10.0,
        },
      ],
    };

    await placeOrder.execute(request);

    const orders = await repository.findAll();
    expect(orders[0].status).toBe("PENDING");
  });

  it("should fail when quantity is invalid", async () => {
    const request: PlaceOrderRequest = {
      orderLines: [
        {
          productId: "PROD-001",
          quantity: 0,
          unitPrice: 49.99,
        },
      ],
    };

    expect(() => placeOrder.execute(request)).rejects.toThrow();
  });
});
