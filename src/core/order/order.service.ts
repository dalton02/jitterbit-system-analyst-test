import { BadRequestError, ConflictError } from "../persistence/utils/errors";
import { OrderDTO } from "./order.dto";
import { OrderRepository } from "./order.repository";

export class OrderService {
  async createOrder(body: OrderDTO.CreateOrder) {
    const orderRepository = new OrderRepository();
    const existingOrder = await orderRepository.findOrderById(
      body.numeroPedido,
    );
    if (existingOrder) {
      throw new BadRequestError("Pedido já existe na base de dados");
    }

    const existingItems = await orderRepository.findItemsByIds(
      body.items.map((item) => item.idItem),
    );

    if (existingItems.length > 0) {
      throw new ConflictError(
        "Um ou mais identificadores de item entraram em conflito com os existentes no banco de dados",
      );
    }
  }
}
