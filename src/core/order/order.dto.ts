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
}
