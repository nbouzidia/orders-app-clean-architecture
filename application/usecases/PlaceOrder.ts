import { PlaceOrderRequest } from "../requests/PlaceOrderRequest";
import { PlaceOrderResponse } from "../responses/PlaceOrderResponse";
import { Usecase } from "./Usecase";
import { OrderRepository } from "../repositories/OrderRepository";
import { IdentifierGenerator } from "../services/IdentifierGenerator";
import { Order } from "../../domain/entities/Order";
import { OrderLine } from "../../domain/entities/OrderLine";
import { OrderStatus } from "../../domain/enumerations/OrderStatus";

export class PlaceOrder
  implements Usecase<PlaceOrderRequest, PlaceOrderResponse>
{
  public constructor(
    private readonly identifierGenerator: IdentifierGenerator,
    private readonly orderRepository: OrderRepository
  ) {}

  public async execute(
    request: PlaceOrderRequest
  ): Promise<PlaceOrderResponse> {
    const orderId = this.identifierGenerator.generate();
    const now = new Date();

    const orderLines = request.orderLines.map((line) => {
      const lineId = this.identifierGenerator.generate();
      return new OrderLine(
        lineId,
        line.productId,
        line.quantity,
        line.unitPrice,
        now,
        now
      );
    });

    const order = new Order(orderId, orderLines, OrderStatus.Pending, now, now);

    const error = await this.orderRepository.create(order);

    if (error) {
      return error;
    }

    return null;
  }
}
