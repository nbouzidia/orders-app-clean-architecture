import { Usecase } from "./Usecase";
import { ListOrdersRequest } from "../requests/ListOrdersRequest";
import { ListOrdersResponse } from "../responses/ListOrdersResponse";
import { OrderRepository } from "../repositories/OrderRepository";

export class ListOrders
  implements Usecase<ListOrdersRequest, ListOrdersResponse>
{
  public constructor(private readonly orderRepository: OrderRepository) {}

  public async execute(
    request: ListOrdersRequest
  ): Promise<ListOrdersResponse> {
    const orders = await this.orderRepository.findAll();
    return orders;
  }
}
