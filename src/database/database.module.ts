import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Order } from '../orders/entities/order.entity';
import { Item } from '../items/entities/item.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    SequelizeModule.forRootAsync({
      useFactory: (config: ConfigService) => ({
        dialect: 'postgres',
        host: config.get('DB_HOST'),
        port: config.get<number>('DB_PORT'),
        username: config.get('DB_USER'),
        password: config.get('DB_PASS'),
        database: config.get('DB_NAME'),
        autoLoadModels: true,
        synchronize: false,
        logging: false
      }),
      inject: [ConfigService],
    }),
    SequelizeModule.forFeature([Order, Item]),
  ],
  exports: [SequelizeModule],
})
export class DatabaseModule {}

