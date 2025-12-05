import { describe, it, expect } from "vitest";
import { OrderLine } from "../domain/entities/OrderLine";
import { InvalidQuantity } from "../domain/errors/InvalidQuantity";

describe("OrderLine Entity", () => {
  describe("Constructor", () => {
    it("should create an order line with valid quantity", () => {
      const orderLine = new OrderLine(
        "line-1",
        "PROD-001",
        2,
        49.99,
        new Date(),
        new Date()
      );

      expect(orderLine.identifier).toBe("line-1");
      expect(orderLine.productId).toBe("PROD-001");
      expect(orderLine.quantity).toBe(2);
      expect(orderLine.unitPrice).toBe(49.99);
    });

    it("should throw error when quantity is 0", () => {
      expect(() => {
        new OrderLine("line-1", "PROD-001", 0, 49.99, new Date(), new Date());
      }).toThrow(InvalidQuantity);
    });

    it("should throw error when quantity is negative", () => {
      expect(() => {
        new OrderLine("line-1", "PROD-001", -5, 49.99, new Date(), new Date());
      }).toThrow(InvalidQuantity);
    });
  });

  describe("totalAmount", () => {
    it("should calculate total amount correctly", () => {
      const orderLine = new OrderLine(
        "line-1",
        "PROD-001",
        3,
        10.5,
        new Date(),
        new Date()
      );

      expect(orderLine.totalAmount).toBe(31.5);
    });

    it("should calculate total amount for quantity 1", () => {
      const orderLine = new OrderLine(
        "line-1",
        "PROD-001",
        1,
        99.99,
        new Date(),
        new Date()
      );

      expect(orderLine.totalAmount).toBe(99.99);
    });
  });

  describe("updateQuantity", () => {
    it("should return new OrderLine with updated quantity", () => {
      const orderLine = new OrderLine(
        "line-1",
        "PROD-001",
        2,
        49.99,
        new Date(),
        new Date()
      );

      const updated = orderLine.updateQuantity(5);

      expect(updated).not.toBe(orderLine);
      expect(updated).toBeInstanceOf(OrderLine);
      if (updated instanceof OrderLine) {
        expect(updated.quantity).toBe(5);
        expect(updated.productId).toBe("PROD-001");
        expect(updated.totalAmount).toBeCloseTo(249.95, 2);
      }
    });

    it("should return InvalidQuantity error when quantity is 0", () => {
      const orderLine = new OrderLine(
        "line-1",
        "PROD-001",
        2,
        49.99,
        new Date(),
        new Date()
      );

      const result = orderLine.updateQuantity(0);

      expect(result).toBeInstanceOf(InvalidQuantity);
    });

    it("should preserve immutability", () => {
      const orderLine = new OrderLine(
        "line-1",
        "PROD-001",
        2,
        49.99,
        new Date(),
        new Date()
      );

      orderLine.updateQuantity(5);

      expect(orderLine.quantity).toBe(2);
    });
  });
});
