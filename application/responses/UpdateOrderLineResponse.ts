import { OrderNotFound } from "../errors/OrderNotFound";
import { OrderSaveFailed } from "../errors/OrderSaveFailed";
import { OrderLineCannotBeModified } from "../../domain/errors/OrderLineCannotBeModified";

export type UpdateOrderLineResponse =
  | null
  | OrderNotFound
  | OrderLineCannotBeModified
  | OrderSaveFailed;
