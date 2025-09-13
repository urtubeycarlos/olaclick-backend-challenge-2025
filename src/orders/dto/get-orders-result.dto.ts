import { ApiProperty } from "@nestjs/swagger";
import { Order } from "../entities/order.entity";

export class GetOrdersResultDTO {
    @ApiProperty({ example: 1, description: 'ID único del pedido' })
    id: number;

    @ApiProperty({ example: 'Juan Pérez', description: 'Nombre del cliente' })
    clientName: string;

    @ApiProperty({ example: 'initiated', description: 'Estado actual del pedido' })
    status: string;

    @ApiProperty({ example: '2025-09-12T21:00:00.000Z', description: 'Fecha de creación' })
    createdAt: Date;

    @ApiProperty({ example: '2025-09-12T21:00:00.000Z', description: 'Fecha de última actualización' })
    updatedAt: Date;

    static fromEntity(entity: Order): GetOrdersResultDTO {
        const dto = new GetOrdersResultDTO();
        dto.id = entity.get().id;
        dto.clientName = entity.get().clientName;
        dto.status = entity.get().status;
        dto.createdAt = entity.get().createdAt;
        dto.updatedAt = entity.get().updatedAt;
        return dto;
    }
}