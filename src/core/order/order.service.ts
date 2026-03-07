import { isValid, parseISO } from "date-fns";
import db from "../persistence/database/dbcon";
import {
  BadRequestError,
  ConflictError,
  NotFoundError,
} from "../persistence/utils/errors";
import { OrderDTO } from "./order.dto";
import { OrderRepository } from "./order.repository";

export class OrderService {
  private validateDate(date: string) {
    const isoRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/;

    if (!isoRegex.test(date)) {
      throw new BadRequestError(
        "Data de criação deve ser um timestamp ISO válido",
      );
    }

    const d = new Date(date);

    if (Number.isNaN(d.getTime())) {
      throw new BadRequestError("Data de criação deve ser uma data válida");
    }
  }

  async createOrder(body: OrderDTO.CreateOrder) {
    this.validateDate(body.dataCriacao);
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

  async updateOrder(params: { body: OrderDTO.UpdateOrder; id: string }) {
    const { body, id } = params;

    this.validateDate(body.dataCriacao);

    const orderRepository = new OrderRepository();
    const existingOrder = await orderRepository.findOrderById(id);

    if (!existingOrder) {
      throw new NotFoundError("Pedido não encontrado");
    }

    const items = existingOrder.items;

    const existingIds = new Set(items.map((item) => item.productId));
    const bodyIds = new Set(body.items.map((item) => item.idItem));

    const toCreateItems = body.items.filter(
      (item) => !existingIds.has(item.idItem),
    );

    const toUpdateItems = body.items.filter((item) =>
      existingIds.has(item.idItem),
    );

    const toDeleteItems = items.filter((item) => !bodyIds.has(item.productId));

    await db.transaction(async (tx) => {
      const orderTransaction = new OrderRepository(tx);
      await orderTransaction.updateOrder({
        creationDate: new Date(body.dataCriacao),
        orderId: id,
        value: body.valorTotal,
      });

      await Promise.all([
        toCreateItems.map(async (item) => {
          await orderTransaction.createItem({
            orderId: id,
            price: item.valorItem,
            productId: item.idItem,
            quantity: item.quantidadeItem,
          });
        }),
        toUpdateItems.map(async (item) => {
          await orderTransaction.updateItem({
            price: item.valorItem,
            productId: item.idItem,
            quantity: item.quantidadeItem,
          });
        }),
        toDeleteItems.map(async (item) => {
          await orderTransaction.deleteItem(item.productId);
        }),
      ]);
    });
    return await orderRepository.findOrderById(id);
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

  async deleteOrder(id: string) {
    const orderRepository = new OrderRepository();
    const order = await orderRepository.findOrderById(id);
    if (!order) {
      throw new NotFoundError("Pedido não encontrado");
    }
    await orderRepository.deleteOrder(id);
    return {};
  }
}
