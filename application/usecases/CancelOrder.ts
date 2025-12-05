import { Usecase } from "./Usecase";
import { CancelOrderRequest } from "../requests/CancelOrderRequest";
import { CancelOrderResponse } from "../responses/CancelOrderResponse";
import { OrderRepository } from "../repositories/OrderRepository";

export class CancelOrder
  implements Usecase<CancelOrderRequest, CancelOrderResponse>
{
  public constructor(private readonly orderRepository: OrderRepository) {}

  public async execute(
    request: CancelOrderRequest
  ): Promise<CancelOrderResponse> {
    const order = await this.orderRepository.findById(request.orderId);

    if (order instanceof Error) {
      return order;
    }

    const canceledOrder = order.cancel();

    if (canceledOrder instanceof Error) {
      return canceledOrder;
    }

    const error = await this.orderRepository.update(canceledOrder);

    if (error) {
      return error;
    }

    return null;
  }
}
