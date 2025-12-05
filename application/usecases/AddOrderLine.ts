import { Usecase } from "./Usecase";
import { AddOrderLineRequest } from "../requests/AddOrderLineRequest";
import { AddOrderLineResponse } from "../responses/AddOrderLineResponse";
import { OrderRepository } from "../repositories/OrderRepository";
import { IdentifierGenerator } from "../services/IdentifierGenerator";
import { OrderLine } from "../../domain/entities/OrderLine";

export class AddOrderLine
  implements Usecase<AddOrderLineRequest, AddOrderLineResponse>
{
  public constructor(
    private readonly identifierGenerator: IdentifierGenerator,
    private readonly orderRepository: OrderRepository
  ) {}

  public async execute(
    request: AddOrderLineRequest
  ): Promise<AddOrderLineResponse> {
    const order = await this.orderRepository.findById(request.orderId);

    if (order instanceof Error) {
      return order;
    }

    const now = new Date();
    const lineId = this.identifierGenerator.generate();
    const orderLine = new OrderLine(
      lineId,
      request.productId,
      request.quantity,
      request.unitPrice,
      now,
      now
    );

    const updatedOrder = order.addOrderLine(orderLine);

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
