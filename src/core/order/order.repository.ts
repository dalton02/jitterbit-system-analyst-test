import { Repository } from "../persistence/database/repository";
import { OrderDTO } from "./order.dto";

export class OrderRepository extends Repository {
  async findOrderById(id: string): Promise<OrderDTO.Order | null> {
    const result = await this.query(
      `SELECT 
        o.orderId,
        o.value,
        o.creationDate,
        item.quantity,
        item.price,
        item.productId
      FROM "order" o
      LEFT JOIN item ON item.orderId = o.orderId
      WHERE o.orderId = $1`,
      [id],
    );

    const rows = result.rows;

    if (rows.length === 0) {
      return null;
    }

    const first = rows[0];

    const order: OrderDTO.Order = {
      orderId: first.orderid,
      value: first.value,
      creationDate: first.creationdate,
      items: [],
    };

    for (const row of rows) {
      if (row.productid) {
        order.items.push({
          productId: row.productid,
          quantity: row.quantity,
          price: row.price,
        });
      }
    }

    return order;
  }

  async findItemsByIds(ids: string[]): Promise<OrderDTO.Item[]> {
    const result = await this.query(
      `SELECT 
        item.quantity,
        item.price,
        item.productId
      FROM "item"  
      WHERE productId  = ANY($1)`,
      [ids],
    );

    const data: OrderDTO.Item[] = result.rows.map((row) => {
      return {
        price: row.price,
        productId: row.productId,
        quantity: row.quantity,
      };
    });

    return data;
  }

  async createOrder() {}
  async createItem() {}
}
