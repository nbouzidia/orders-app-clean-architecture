import { Order } from "../../domain/entities/Order";
import { OrderSaveFailed } from "../errors/OrderSaveFailed";
import { OrderNotFound } from "../errors/OrderNotFound";

export interface OrderRepository {
  create(order: Order): Promise<null | OrderSaveFailed>;
  update(order: Order): Promise<null | OrderSaveFailed>;
  findById(orderId: string): Promise<Order | OrderNotFound>;
  findAll(): Promise<Order[]>;
}
