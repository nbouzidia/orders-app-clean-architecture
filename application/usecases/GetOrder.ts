import { Usecase } from "./Usecase";
import { GetOrderRequest } from "../requests/GetOrderRequest";
import { GetOrderResponse } from "../responses/GetOrderResponse";
import { OrderRepository } from "../repositories/OrderRepository";

export class GetOrder implements Usecase<GetOrderRequest, GetOrderResponse> {
  public constructor(private readonly orderRepository: OrderRepository) {}

  public async execute(request: GetOrderRequest): Promise<GetOrderResponse> {
    const order = await this.orderRepository.findById(request.orderId);
    return order;
  }
}
