import { Usecase } from "./Usecase";
import { UpdateOrderLineRequest } from "../requests/UpdateOrderLineRequest";
import { UpdateOrderLineResponse } from "../responses/UpdateOrderLineResponse";
import { OrderRepository } from "../repositories/OrderRepository";

export class UpdateOrderLine
  implements Usecase<UpdateOrderLineRequest, UpdateOrderLineResponse>
{
  public constructor(private readonly orderRepository: OrderRepository) {}

  public async execute(
    request: UpdateOrderLineRequest
  ): Promise<UpdateOrderLineResponse> {
    const order = await this.orderRepository.findById(request.orderId);

    if (order instanceof Error) {
      return order;
    }

    const updatedOrder = order.updateOrderLine(
      request.orderLineId,
      request.quantity
    );

    if (updatedOrder instanceof Error) {
      return updatedOrder;
    }

    const error = await this.orderRepository.update(updatedOrder);

    if (error) {
      return error;
    }

    return null;
  }
}
