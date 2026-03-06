import { Controller, Get, Route, Response, SuccessResponse } from "tsoa";
import { OrderDTO } from "./order.dto";
import db from "../persistence/database/dbcon";
db;
@Route("order")
export class OrderController extends Controller {
  @Response<OrderDTO.Test>(201, "Pedido encontrado", {
    a: "aaa",
    b: 1,
  })
  @Get("{orderId}")
  async getOrder() {}
}
