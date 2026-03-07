import db from "../persistence/database/dbcon";
import {
  BadRequestError,
  ConflictError,
  NotFoundError,
} from "../persistence/utils/errors";
import { OrderDTO } from "./order.dto";
import { OrderRepository } from "./order.repository";

export class OrderService {
  async createOrder(body: OrderDTO.CreateOrder) {
    const orderRepository = new OrderRepository();
    const existingOrder = await orderRepository.findOrderById(
      body.numeroPedido,
    );

    if (existingOrder) {
      throw new ConflictError("Pedido já existe na base de dados");
    }

    const existingItems = await orderRepository.findItemsByIds(
      body.items.map((item) => item.idItem),
    );

    if (existingItems.length > 0) {
      throw new ConflictError(
        "Um ou mais identificadores de item entraram em conflito com os existentes no banco de dados",
      );
    }

    await db.transaction(async (tx) => {
      const orderTransaction = new OrderRepository(tx);
      await orderTransaction.createOrder({
        creationDate: new Date(body.dataCriacao),
        orderId: body.numeroPedido,
        value: body.valorTotal,
      });

      await Promise.all(
        body.items.map(async (item) => {
          await orderTransaction.createItem({
            orderId: body.numeroPedido,
            price: item.valorItem,
            productId: item.idItem,
            quantity: item.quantidadeItem,
          });
        }),
      );
    });
    return await orderRepository.findOrderById(body.numeroPedido);
  }

  async findOrder(id: string): Promise<OrderDTO.Order> {
    const orderRepository = new OrderRepository();
    const order = await orderRepository.findOrderById(id);
    if (!order) {
      throw new NotFoundError("Pedido não encontrado");
    }
    return order;
  }

  async listOrders(params: {
    page: number;
    limit: number;
  }): Promise<OrderDTO.ListOrders> {
    const orderRepository = new OrderRepository();
    return await orderRepository.listOrders(params);
  }
}
