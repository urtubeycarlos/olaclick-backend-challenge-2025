import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectModel } from '@nestjs/sequelize';
import { Order } from 'src/orders/entities/order.entity';
import { logger } from '../winston.config'

@Injectable()
export class OrderCleanupJob {
  constructor(
    @InjectModel(Order) private readonly orderModel: typeof Order,
  ) {}

  // Ejecuta cada 12 horas
  @Cron('0 */12 * * *')
  async handleCleanup() {
    logger.info('🧹 Iniciando limpieza de órdenes entregadas...');
    
    const deleted = await this.orderModel.destroy({
      where: { status: 'delivered' },
    });

    logger.info(`🧹 Limpieza completada: ${deleted} órdenes eliminadas`);
  }
}
