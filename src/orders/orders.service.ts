import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import { getNextStatus, hasNextStatus, nextStatus, Order, OrderStatusEnum } from './entities/order.entity';
import { Item } from '../items/entities/item.entity';
import { CreateOrderDTO } from './dto/create-order.dto';
import { Op, Sequelize } from 'sequelize';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';

@Injectable()
export class OrdersService {
    constructor(
        @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
        @InjectConnection() private readonly sequelize: Sequelize,
        @InjectModel(Order) private readonly orderModel: typeof Order
    ) { }

    async findAllNotDelivered(): Promise<Order[]> {
        const cacheKey = 'orders:not-delivered';
        const cached = await this.cacheManager.get<Order[]>(cacheKey);
        if (cached) return cached;

        const orders = await this.orderModel.findAll({
            include: [Item],
            where: {
                status: {
                    [Op.not]: 'delivered',
                },
            },
            order: [['createdAt', 'DESC']],
        });

        await this.cacheManager.set(cacheKey, orders);
        return orders;
    }

    async findById(id: number): Promise<Order> {
        const cacheKey = `order:${id}`;
        const cached = await this.cacheManager.get<Order>(cacheKey);
        if (cached) return cached;

        const order = await this.orderModel.findByPk(id, {
            include: [Item],
        });

        if (!order) throw new NotFoundException(`Order with id ${id} not found`);

        await this.cacheManager.set(cacheKey, order);
        return order;
    }

    async createOrderWithItems(dto: CreateOrderDTO): Promise<Order> {
        let order = await this.sequelize.transaction(async (t) => {
            const newOrder = await this.orderModel.create(
                {
                    clientName: dto.clientName,
                    status: OrderStatusEnum.INITIATED,
                    items: dto.items,
                },
                {
                    include: [Item],
                    transaction: t,
                }
            );

            return newOrder;
        });

        order = await order.reload({ include: [Item] });
        await this.cacheManager.del('orders:not-delivered');
        await this.cacheManager.set(`order:${order.id}`, order);
        return order;
    }

    async updateOrderStatus(orderId: number): Promise<Order> {
        const existingOrder = await this.orderModel.findByPk(orderId);
        if (!existingOrder) throw new NotFoundException(`Order with id ${orderId} not found`);

        const currentStatus: string = existingOrder.get().status;
        if (!hasNextStatus(currentStatus)) {
            throw new BadRequestException(`No further status transitions available from "${currentStatus}"`);
        }

        const nextStatusValue = getNextStatus(currentStatus);
        if (!nextStatusValue) {
            throw new BadRequestException(`No further status transitions available from "${currentStatus}"`);
        }

        await this.orderModel.update({ status: nextStatusValue }, { where: { id: orderId } });
        const updatedOrder = await this.orderModel.findByPk(orderId, { include: [Item] });
        await updatedOrder?.reload();
        await this.cacheManager.del('orders:not-delivered');
        await this.cacheManager.set(`order:${orderId}`, updatedOrder);

        if (!updatedOrder) {
            throw new NotFoundException(`Order with id ${orderId} not found after update`);
        }
        
        return updatedOrder;
    }
}
