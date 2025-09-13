import { Body, Controller, Get, HttpException, Param, Post, Query, UseInterceptors } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { StatusCodes } from 'http-status-codes';
import { CreateOrderResultDTO } from './dto/create-order-result.dto';
import { CreateOrderDTO } from './dto/create-order.dto';
import { LoggingInterceptor } from 'src/common/interceptors/logging.interceptor';
import { Order } from './entities/order.entity';
import { ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import { GetOrderResultDTO } from './dto/get-order-result.dto';
import { GetOrdersResultDTO } from './dto/get-orders-result.dto';
import { UpdateOrderStatusResultDTO } from './dto/update-order-status-result.dto';

@Controller('orders')
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) { }

    @ApiCreatedResponse({
        description: 'Orden creada exitosamente',
        type: CreateOrderResultDTO,
    })
    @UseInterceptors(new LoggingInterceptor())
    @Post('/')
    async createOrder(@Body() requestBody: CreateOrderDTO): Promise<CreateOrderResultDTO> {
        try {
            const result: Order = await this.ordersService.createOrderWithItems(requestBody);
            return CreateOrderResultDTO.fromEntity(result);
        } catch (error) {
            throw new HttpException(error.message, StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }
    
    @ApiOkResponse({
        description: 'Listado de órdenes',
        type: [GetOrdersResultDTO],
    })
    @UseInterceptors(new LoggingInterceptor())
    @Get('/')
    async getOrders(): Promise<GetOrdersResultDTO[]> {
        try {
            const result: Order[] = await this.ordersService.findAllNotDelivered();
            return result.map((order) => GetOrdersResultDTO.fromEntity(order));
        } catch (error) {
            throw new HttpException(error.message, StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    @ApiOkResponse({
        description: 'Detalle de la orden',
        type: GetOrderResultDTO,
    })
    @UseInterceptors(new LoggingInterceptor())
    @Get(':id')
    async getOrderById(@Param('id') id: number): Promise<GetOrderResultDTO> {
        try {
            const result: Order = await this.ordersService.findById(id);
            return GetOrderResultDTO.fromEntity(result);
        } catch (error) {
            throw new HttpException(error.message, StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    @ApiOkResponse({
        description: 'Estado de la orden actualizado',
        type: UpdateOrderStatusResultDTO,
    })
    @UseInterceptors(new LoggingInterceptor())
    @Post(':id/advance')
    async moveToNextStatus(@Param('id') id: number): Promise<UpdateOrderStatusResultDTO> {
        try {
            const result: Order = await this.ordersService.updateOrderStatus(id);
            return UpdateOrderStatusResultDTO.fromEntity(result);
        } catch (error) {
            throw new HttpException(error.message, StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }
}
