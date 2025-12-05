import { describe, it, expect } from "vitest";
import { Order } from "../domain/entities/Order";
import { OrderLine } from "../domain/entities/OrderLine";
import { OrderStatus } from "../domain/enumerations/OrderStatus";
import { OrderMustHaveAtLeastOneOrderLine } from "../domain/errors/OrderMustHaveAtLeastOneOrderLine";
import { OrderCannotBeCanceled } from "../domain/errors/OrderCannotBeCanceled";
import { OrderLineCannotBeModified } from "../domain/errors/OrderLineCannotBeModified";
import { InvalidStatusTransition } from "../domain/errors/InvalidStatusTransition";

describe("Order Entity", () => {
  const createOrderLine = (
    id: string,
    productId: string,
    quantity: number,
    price: number
  ): OrderLine => {
    return new OrderLine(
      id,
      productId,
      quantity,
      price,
      new Date(),
      new Date()
    );
  };

  describe("Constructor", () => {
    it("should create an order with valid order lines", () => {
      const lines = [createOrderLine("line-1", "PROD-001", 2, 49.99)];
      const order = new Order(
        "order-1",
        lines,
        OrderStatus.Pending,
        new Date(),
        new Date()
      );

      expect(order.identifier).toBe("order-1");
      expect(order.orderLines).toHaveLength(1);
      expect(order.status).toBe(OrderStatus.Pending);
    });

    it("should throw error when order has no lines", () => {
      expect(() => {
        new Order("order-1", [], OrderStatus.Pending, new Date(), new Date());
      }).toThrow(OrderMustHaveAtLeastOneOrderLine);
    });
  });

  describe("totalAmount", () => {
    it("should calculate total from multiple order lines", () => {
      const lines = [
        createOrderLine("line-1", "PROD-001", 2, 49.99),
        createOrderLine("line-2", "PROD-002", 1, 29.99),
      ];
      const order = new Order(
        "order-1",
        lines,
        OrderStatus.Pending,
        new Date(),
        new Date()
      );

      expect(order.totalAmount).toBe(129.97);
    });

    it("should calculate total from single order line", () => {
      const lines = [createOrderLine("line-1", "PROD-001", 3, 10.0)];
      const order = new Order(
        "order-1",
        lines,
        OrderStatus.Pending,
        new Date(),
        new Date()
      );

      expect(order.totalAmount).toBe(30.0);
    });
  });

  describe("cancel", () => {
    it("should cancel order when status is PENDING", () => {
      const lines = [createOrderLine("line-1", "PROD-001", 2, 49.99)];
      const order = new Order(
        "order-1",
        lines,
        OrderStatus.Pending,
        new Date(),
        new Date()
      );

      const result = order.cancel();

      expect(result).toBeInstanceOf(Order);
      if (result instanceof Order) {
        expect(result.status).toBe(OrderStatus.Canceled);
      }
    });

    it("should return error when canceling PAID order", () => {
      const lines = [createOrderLine("line-1", "PROD-001", 2, 49.99)];
      const order = new Order(
        "order-1",
        lines,
        OrderStatus.Paid,
        new Date(),
        new Date()
      );

      const result = order.cancel();

      expect(result).toBeInstanceOf(OrderCannotBeCanceled);
    });

    it("should return error when canceling SHIPPED order", () => {
      const lines = [createOrderLine("line-1", "PROD-001", 2, 49.99)];
      const order = new Order(
        "order-1",
        lines,
        OrderStatus.Shipped,
        new Date(),
        new Date()
      );

      const result = order.cancel();

      expect(result).toBeInstanceOf(OrderCannotBeCanceled);
    });
  });

  describe("updateStatus", () => {
    it("should transition from PENDING to PAID", () => {
      const lines = [createOrderLine("line-1", "PROD-001", 2, 49.99)];
      const order = new Order(
        "order-1",
        lines,
        OrderStatus.Pending,
        new Date(),
        new Date()
      );

      const result = order.updateStatus(OrderStatus.Paid);

      expect(result).toBeInstanceOf(Order);
      if (result instanceof Order) {
        expect(result.status).toBe(OrderStatus.Paid);
      }
    });

    it("should transition from PAID to SHIPPED", () => {
      const lines = [createOrderLine("line-1", "PROD-001", 2, 49.99)];
      const order = new Order(
        "order-1",
        lines,
        OrderStatus.Paid,
        new Date(),
        new Date()
      );

      const result = order.updateStatus(OrderStatus.Shipped);

      expect(result).toBeInstanceOf(Order);
      if (result instanceof Order) {
        expect(result.status).toBe(OrderStatus.Shipped);
      }
    });

    it("should return error when going backwards (PAID to PENDING)", () => {
      const lines = [createOrderLine("line-1", "PROD-001", 2, 49.99)];
      const order = new Order(
        "order-1",
        lines,
        OrderStatus.Paid,
        new Date(),
        new Date()
      );

      const result = order.updateStatus(OrderStatus.Pending);

      expect(result).toBeInstanceOf(InvalidStatusTransition);
    });

    it("should return error when transitioning from CANCELED", () => {
      const lines = [createOrderLine("line-1", "PROD-001", 2, 49.99)];
      const order = new Order(
        "order-1",
        lines,
        OrderStatus.Canceled,
        new Date(),
        new Date()
      );

      const result = order.updateStatus(OrderStatus.Paid);

      expect(result).toBeInstanceOf(InvalidStatusTransition);
    });
  });

  describe("addOrderLine", () => {
    it("should add new order line", () => {
      const lines = [createOrderLine("line-1", "PROD-001", 2, 49.99)];
      const order = new Order(
        "order-1",
        lines,
        OrderStatus.Pending,
        new Date(),
        new Date()
      );
      const newLine = createOrderLine("line-2", "PROD-002", 1, 29.99);

      const result = order.addOrderLine(newLine);

      expect(result).toBeInstanceOf(Order);
      if (result instanceof Order) {
        expect(result.orderLines).toHaveLength(2);
        expect(result.totalAmount).toBe(129.97);
      }
    });

    it("should update quantity when product already exists", () => {
      const lines = [createOrderLine("line-1", "PROD-001", 2, 49.99)];
      const order = new Order(
        "order-1",
        lines,
        OrderStatus.Pending,
        new Date(),
        new Date()
      );
      const newLine = createOrderLine("line-2", "PROD-001", 3, 49.99);

      const result = order.addOrderLine(newLine);

      expect(result).toBeInstanceOf(Order);
      if (result instanceof Order) {
        expect(result.orderLines).toHaveLength(1);
        expect(result.orderLines[0].quantity).toBe(5);
        expect(result.totalAmount).toBeCloseTo(249.95, 2);
      }
    });

    it("should return error when order is CANCELED", () => {
      const lines = [createOrderLine("line-1", "PROD-001", 2, 49.99)];
      const order = new Order(
        "order-1",
        lines,
        OrderStatus.Canceled,
        new Date(),
        new Date()
      );
      const newLine = createOrderLine("line-2", "PROD-002", 1, 29.99);

      const result = order.addOrderLine(newLine);

      expect(result).toBeInstanceOf(OrderLineCannotBeModified);
    });

    it("should return error when order is SHIPPED", () => {
      const lines = [createOrderLine("line-1", "PROD-001", 2, 49.99)];
      const order = new Order(
        "order-1",
        lines,
        OrderStatus.Shipped,
        new Date(),
        new Date()
      );
      const newLine = createOrderLine("line-2", "PROD-002", 1, 29.99);

      const result = order.addOrderLine(newLine);

      expect(result).toBeInstanceOf(OrderLineCannotBeModified);
    });
  });

  describe("removeOrderLine", () => {
    it("should remove order line", () => {
      const lines = [
        createOrderLine("line-1", "PROD-001", 2, 49.99),
        createOrderLine("line-2", "PROD-002", 1, 29.99),
      ];
      const order = new Order(
        "order-1",
        lines,
        OrderStatus.Pending,
        new Date(),
        new Date()
      );

      const result = order.removeOrderLine("line-1");

      expect(result).toBeInstanceOf(Order);
      if (result instanceof Order) {
        expect(result.orderLines).toHaveLength(1);
        expect(result.orderLines[0].productId).toBe("PROD-002");
        expect(result.totalAmount).toBe(29.99);
      }
    });

    it("should return error when removing last order line", () => {
      const lines = [createOrderLine("line-1", "PROD-001", 2, 49.99)];
      const order = new Order(
        "order-1",
        lines,
        OrderStatus.Pending,
        new Date(),
        new Date()
      );

      const result = order.removeOrderLine("line-1");

      expect(result).toBeInstanceOf(OrderMustHaveAtLeastOneOrderLine);
    });

    it("should return error when order is CANCELED", () => {
      const lines = [
        createOrderLine("line-1", "PROD-001", 2, 49.99),
        createOrderLine("line-2", "PROD-002", 1, 29.99),
      ];
      const order = new Order(
        "order-1",
        lines,
        OrderStatus.Canceled,
        new Date(),
        new Date()
      );

      const result = order.removeOrderLine("line-1");

      expect(result).toBeInstanceOf(OrderLineCannotBeModified);
    });
  });

  describe("updateOrderLine", () => {
    it("should update order line quantity", () => {
      const lines = [createOrderLine("line-1", "PROD-001", 2, 49.99)];
      const order = new Order(
        "order-1",
        lines,
        OrderStatus.Pending,
        new Date(),
        new Date()
      );

      const result = order.updateOrderLine("line-1", 5);

      expect(result).toBeInstanceOf(Order);
      if (result instanceof Order) {
        expect(result.orderLines[0].quantity).toBe(5);
        expect(result.totalAmount).toBeCloseTo(249.95, 2);
      }
    });

    it("should return error when order is SHIPPED", () => {
      const lines = [createOrderLine("line-1", "PROD-001", 2, 49.99)];
      const order = new Order(
        "order-1",
        lines,
        OrderStatus.Shipped,
        new Date(),
        new Date()
      );

      const result = order.updateOrderLine("line-1", 5);

      expect(result).toBeInstanceOf(OrderLineCannotBeModified);
    });

    it("should preserve immutability", () => {
      const lines = [createOrderLine("line-1", "PROD-001", 2, 49.99)];
      const order = new Order(
        "order-1",
        lines,
        OrderStatus.Pending,
        new Date(),
        new Date()
      );

      order.updateOrderLine("line-1", 5);

      expect(order.orderLines[0].quantity).toBe(2);
    });
  });
});
