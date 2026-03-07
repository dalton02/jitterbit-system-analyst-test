import { Repository } from "../persistence/database/repository";
import { OrderDTO } from "./order.dto";
import { PickType, OmitType, PartialType } from "@nestjs/mapped-types";
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

  async listOrders(params: {
    page: number;
    limit: number;
  }): Promise<OrderDTO.ListOrders> {
    const { limit, page } = params;
    const offset = (page - 1) * limit;

    const countResult = await this.query(`SELECT COUNT(*) FROM "order"`);

    const total = Number(countResult.rows[0].count);
    const totalPages = Math.ceil(total / limit);

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
      ORDER BY o.creationDate DESC
      LIMIT $1 OFFSET $2`,
      [limit, offset],
    );

    const rows = result.rows;

    const ordersMap = new Map<string, OrderDTO.Order>();

    for (const row of rows) {
      if (!ordersMap.has(row.orderid)) {
        ordersMap.set(row.orderid, {
          orderId: row.orderid,
          value: row.value,
          creationDate: row.creationdate,
          items: [],
        });
      }

      if (row.productid) {
        ordersMap.get(row.orderid)!.items.push({
          productId: row.productid,
          quantity: row.quantity,
          price: row.price,
        });
      }
    }

    return {
      data: Array.from(ordersMap.values()),
      totalPages,
      total,
    };
  }

  async createOrder(data: {
    orderId: string;
    value: number;
    creationDate: Date;
  }) {
    await this.query(
      `INSERT INTO "order" (orderId,value,creationDate) VALUES ($1,$2,$3)`,
      [data.orderId, data.value, data.creationDate],
    );
  }
  async createItem(data: {
    orderId: string;
    productId: string;
    quantity: number;
    price: number;
  }) {
    await this.query(
      `INSERT INTO "item"(orderId,productId,quantity,price) VALUES ($1,$2,$3,$4)`,
      [data.orderId, data.productId, data.quantity, data.price],
    );
  }
}
