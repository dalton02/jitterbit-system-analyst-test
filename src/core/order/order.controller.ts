import {
  Controller,
  Get,
  Route,
  Response,
  SuccessResponse,
  Post,
  Body,
} from "tsoa";
import { OrderDTO } from "./order.dto";
import db from "../persistence/database/dbcon";
import { OrderService } from "./order.service";
db;
@Route("order")
export class OrderController extends Controller {
  private orderService = new OrderService();

  @Response(201, "Pedido criado com sucesso")
  @Post("")
  async getOrder(@Body() body: OrderDTO.CreateOrder) {
    return this.orderService.createOrder(body);
  }
}
