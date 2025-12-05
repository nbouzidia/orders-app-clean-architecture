import { OrderNotFound } from "../errors/OrderNotFound";
import { OrderSaveFailed } from "../errors/OrderSaveFailed";
import { OrderLineCannotBeModified } from "../../domain/errors/OrderLineCannotBeModified";
import { OrderMustHaveAtLeastOneOrderLine } from "../../domain/errors/OrderMustHaveAtLeastOneOrderLine";

export type RemoveOrderLineResponse =
  | null
  | OrderNotFound
  | OrderLineCannotBeModified
  | OrderMustHaveAtLeastOneOrderLine
  | OrderSaveFailed;
