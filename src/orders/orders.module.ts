import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { DatabaseModule } from 'src/database/database.module';
import { CacheModule } from '@nestjs/cache-manager';
import Redis from 'ioredis';
import { ConfigService } from '@nestjs/config';
import { OrderCleanupJob } from 'src/common/jobs/order-cleanup.job';

@Module({
  imports: [
    DatabaseModule,
    CacheModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        store: new Redis({
          host: configService.get<string>('REDIS_HOST'),
          port: configService.get<number>('REDIS_PORT'),
        }),
      }),
    }),
  ],
  controllers: [OrdersController],
  providers: [OrdersService, OrderCleanupJob],
})
export class OrdersModule { }
