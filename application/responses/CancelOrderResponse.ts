import { OrderNotFound } from "../errors/OrderNotFound";
import { OrderSaveFailed } from "../errors/OrderSaveFailed";
import { OrderCannotBeCanceled } from "../../domain/errors/OrderCannotBeCanceled";

export type CancelOrderResponse =
  | null
  | OrderNotFound
  | OrderCannotBeCanceled
  | OrderSaveFailed;
