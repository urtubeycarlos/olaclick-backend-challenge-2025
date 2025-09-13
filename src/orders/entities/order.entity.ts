import { Table, Column, Model, DataType, HasMany, BelongsTo, ForeignKey } from 'sequelize-typescript';
import { Item } from '../../items/entities/item.entity';

export enum OrderStatusEnum {
    INITIATED = 'initiated',
    SENT = 'sent',
    DELIVERED = 'delivered',
}

export const nextStatus = {
    [OrderStatusEnum.INITIATED]: OrderStatusEnum.SENT,
    [OrderStatusEnum.SENT]: OrderStatusEnum.DELIVERED,
    [OrderStatusEnum.DELIVERED]: null,
}

export const getNextStatus = (status: string): string | null => {
    return nextStatus[status] || null;
}

export const hasNextStatus = (status: string): boolean => {
    return nextStatus[status] !== null;
}

@Table({ tableName: 'orders', timestamps: true })
export class Order extends Model {
    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    public clientName: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    public status: string;

    @HasMany(() => Item, {
        onDelete: 'CASCADE',
        hooks: true,
    })
    public items: Item[];
}
