import express from "express";
import { NodeIdentifierGenerator } from "../services/NodeIdentifierGenerator.js";
import { MemoryOrderRepository } from "../repositories/MemoryOrderRepository.js";
import { PlaceOrder } from "../../application/usecases/PlaceOrder.js";
import { CancelOrder } from "../../application/usecases/CancelOrder.js";
import { AddOrderLine } from "../../application/usecases/AddOrderLine.js";
import { UpdateOrderLine } from "../../application/usecases/UpdateOrderLine.js";
import { RemoveOrderLine } from "../../application/usecases/RemoveOrderLine.js";
import { GetOrder } from "../../application/usecases/GetOrder.js";
import { ListOrders } from "../../application/usecases/ListOrders.js";

const server = express();
server.use(express.json());

const identifierGenerator = new NodeIdentifierGenerator();
const orderRepository = new MemoryOrderRepository();

server.post("/orders", async (request, response) => {
  const placeOrder = new PlaceOrder(identifierGenerator, orderRepository);
  const error = await placeOrder.execute(request.body);

  if (error) {
    return response.status(400).json({
      error: error.message || "Failed to place order",
    });
  }

  response.status(201).json({
    message: "Order placed successfully",
  });
});

server.get("/orders", async (request, response) => {
  const listOrders = new ListOrders(orderRepository);
  const orders = await listOrders.execute({});

  const formattedOrders = orders.map((order) => ({
    identifier: order.identifier,
    status: order.status,
    totalAmount: order.totalAmount,
    orderLines: order.orderLines.map((line) => ({
      identifier: line.identifier,
      productId: line.productId,
      quantity: line.quantity,
      unitPrice: line.unitPrice,
      totalAmount: line.totalAmount,
    })),
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
  }));

  response.json({
    orders: formattedOrders,
  });
});

server.get("/orders/:id", async (request, response) => {
  const getOrder = new GetOrder(orderRepository);
  const result = await getOrder.execute({ orderId: request.params.id });

  if (result instanceof Error) {
    return response.status(404).json({
      error: result.message,
    });
  }

  response.json({
    identifier: result.identifier,
    status: result.status,
    totalAmount: result.totalAmount,
    orderLines: result.orderLines.map((line) => ({
      identifier: line.identifier,
      productId: line.productId,
      quantity: line.quantity,
      unitPrice: line.unitPrice,
      totalAmount: line.totalAmount,
    })),
    createdAt: result.createdAt,
    updatedAt: result.updatedAt,
  });
});

server.post("/orders/:id/cancel", async (request, response) => {
  const cancelOrder = new CancelOrder(orderRepository);
  const error = await cancelOrder.execute({ orderId: request.params.id });

  if (error) {
    return response.status(400).json({
      error: error.message || "Failed to cancel order",
    });
  }

  response.json({
    message: "Order canceled successfully",
  });
});

server.post("/orders/:id/lines", async (request, response) => {
  const addOrderLine = new AddOrderLine(identifierGenerator, orderRepository);
  const error = await addOrderLine.execute({
    orderId: request.params.id,
    productId: request.body.productId,
    quantity: request.body.quantity,
    unitPrice: request.body.unitPrice,
  });

  if (error) {
    return response.status(400).json({
      error: error.message || "Failed to add order line",
    });
  }

  response.status(201).json({
    message: "Order line added successfully",
  });
});

server.put("/orders/:id/lines/:lineId", async (request, response) => {
  const updateOrderLine = new UpdateOrderLine(orderRepository);
  const error = await updateOrderLine.execute({
    orderId: request.params.id,
    orderLineId: request.params.lineId,
    quantity: request.body.quantity,
  });

  if (error) {
    return response.status(400).json({
      error: error.message || "Failed to update order line",
    });
  }

  response.json({
    message: "Order line updated successfully",
  });
});

server.delete("/orders/:id/lines/:lineId", async (request, response) => {
  const removeOrderLine = new RemoveOrderLine(orderRepository);
  const error = await removeOrderLine.execute({
    orderId: request.params.id,
    orderLineId: request.params.lineId,
  });

  if (error) {
    return response.status(400).json({
      error: error.message || "Failed to remove order line",
    });
  }

  response.json({
    message: "Order line removed successfully",
  });
});

const PORT = 3000;
server.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server listening on http://localhost:${PORT}`);
  console.log("📚 Available endpoints:");
  console.log("  POST   /orders              - Place a new order");
  console.log("  GET    /orders              - List all orders");
  console.log("  GET    /orders/:id          - Get order by ID");
  console.log("  POST   /orders/:id/cancel   - Cancel an order");
  console.log("  POST   /orders/:id/lines    - Add order line");
  console.log("  PUT    /orders/:id/lines/:lineId - Update order line");
  console.log("  DELETE /orders/:id/lines/:lineId - Remove order line");
});
