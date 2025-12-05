import { OrderRepository } from "../../application/repositories/OrderRepository";
import { Order } from "../../domain/entities/Order";
import { OrderSaveFailed } from "../../application/errors/OrderSaveFailed";
import { OrderNotFound } from "../../application/errors/OrderNotFound";

export class MemoryOrderRepository implements OrderRepository {
  public constructor(private readonly orders: Map<string, Order> = new Map()) {}

  public async create(order: Order): Promise<null | OrderSaveFailed> {
    if (this.orders.has(order.identifier)) {
      return new OrderSaveFailed("Order already exists");
    }

    this.orders.set(order.identifier, order);
    return null;
  }

  public async update(order: Order): Promise<null | OrderSaveFailed> {
    if (!this.orders.has(order.identifier)) {
      return new OrderSaveFailed("Order not found");
    }

    this.orders.set(order.identifier, order);
    return null;
  }

  public async findById(orderId: string): Promise<Order | OrderNotFound> {
    const order = this.orders.get(orderId);

    if (!order) {
      return new OrderNotFound(orderId);
    }

    return order;
  }

  public async findAll(): Promise<Order[]> {
    return [...this.orders.values()];
  }
}
