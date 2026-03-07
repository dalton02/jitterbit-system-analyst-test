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
  Delete,
  Put,
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

  @SuccessResponse(200, "Pedido deletado")
  @Response(404, "Pedido não encontrado")
  @Delete("/{orderId}")
  async deleteOrder(@Path("orderId") orderId: string) {
    return this.orderService.deleteOrder(orderId);
  }

  @SuccessResponse(200, "Pedido editado com sucesso")
  @Response<OrderDTO.Order>(
    200,
    "Pedido editado com sucesso",
    OrderExample.Order,
  )
  @Response(404, "Pedido não encontrado")
  @Put("/{orderId}")
  async updateOrder(
    @Path("orderId") orderId: string,
    @Body() body: OrderDTO.UpdateOrder,
  ) {
    return this.orderService.updateOrder({ body, id: orderId });
  }
}
