import { OrderSaveFailed } from "../errors/OrderSaveFailed";

export type PlaceOrderResponse = null | OrderSaveFailed | Error;
