import {
  Controller,
  Get,
  Route,
  Response,
  Post,
  Body,
  Path,
  SuccessResponse,
  Query,
} from "tsoa";
import { OrderDTO, OrderExample } from "./order.dto";
import { OrderService } from "./order.service";

@Route("order")
export class OrderController extends Controller {
  private orderService = new OrderService();

  @SuccessResponse(201, "Pedido criado com sucesso")
  @Response<OrderDTO.Order>(
    201,
    "Pedido criado com sucesso",
    OrderExample.Order,
  )
  @Response(409, "Identificador de pedido já existe no banco")
  @Response(409, "Um ou mais identificadores de item já existe no banco")
  @Post("")
  async createOrder(@Body() body: OrderDTO.CreateOrder) {
    return this.orderService.createOrder(body);
  }

  @SuccessResponse(200, "Listagem concluida")
  @Response<OrderDTO.ListOrders>(200, "Listagem concluida", OrderExample.List)
  @Get("/list")
  async listOrders(@Query("page") page: number, @Query("limit") limit: number) {
    return this.orderService.listOrders({ page, limit });
  }

  @SuccessResponse(200, "Pedido encontrado com sucesso")
  @Response<OrderDTO.Order>(
    200,
    "Pedido encontrado com sucesso",
    OrderExample.Order,
  )
  @Response(404, "Pedido não encontrado")
  @Get("/{orderId}")
  async getOrder(@Path("orderId") orderId: string) {
    return this.orderService.findOrder(orderId);
  }
}
