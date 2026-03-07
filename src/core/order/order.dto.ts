export namespace OrderDTO {
  export type CreateItem = {
    idItem: string;
    quantidadeItem: number;
    valorItem: number;
  };

  export type CreateOrder = {
    numeroPedido: string;
    valorTotal: number;
    dataCriacao: string;
    items: CreateItem[];
  };

  export type Item = {
    productId: string;
    quantity: number;
    price: number;
  };

  export type Order = {
    orderId: string;
    value: number;
    creationDate: string;
    items: Item[];
  };

  export type ListOrders = {
    data: Order[];
    totalPages: number;
    total: number;
  };
}

export namespace OrderExample {
  export const Item: OrderDTO.Item = {
    price: 100,
    productId: "123",
    quantity: 1000,
  };

  export const Order: OrderDTO.Order = {
    creationDate: new Date().toISOString(),
    items: [Item, Item],
    orderId: "123",
    value: 10000,
  };
  export const List: OrderDTO.ListOrders = {
    data: [Order],
    total: 10,
    totalPages: 1,
  };
}
