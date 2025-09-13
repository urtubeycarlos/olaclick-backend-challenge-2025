import { Table, Column, Model, DataType, BelongsTo, ForeignKey } from 'sequelize-typescript';
import { Order } from 'src/orders/entities/order.entity';

@Table({ tableName: 'items', timestamps: true })
export class Item extends Model {
    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    public description: string;

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    public quantity: number;

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    public unitPrice: number;

    @ForeignKey(() => Order)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    public orderId: number;

    @BelongsTo(() => Order)
    public order: Order;
}