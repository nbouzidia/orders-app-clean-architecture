import { Order } from "../../domain/entities/Order";
import { OrderNotFound } from "../errors/OrderNotFound";

export type GetOrderResponse = Order | OrderNotFound;
