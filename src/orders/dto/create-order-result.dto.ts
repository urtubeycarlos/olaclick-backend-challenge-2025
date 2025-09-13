
import { ApiProperty } from '@nestjs/swagger';
import { CreateItemResultDTO } from '../../items/dto/create-item-result.dto';
import { Order } from '../entities/order.entity';

export class CreateOrderResultDTO {
    @ApiProperty({ example: 1, description: 'ID único del pedido' })
    id: number;

    @ApiProperty({ example: 'Juan Pérez', description: 'Nombre del cliente' })
    clientName: string;

    @ApiProperty({ example: 'initiated', description: 'Estado actual del pedido' })
    status: string;

    @ApiProperty({ type: [CreateItemResultDTO], description: 'Listado de ítems del pedido' })
    items: CreateItemResultDTO[];

    @ApiProperty({ example: '2025-09-12T21:00:00.000Z', description: 'Fecha de creación' })
    createdAt: Date;

    @ApiProperty({ example: '2025-09-12T21:00:00.000Z', description: 'Fecha de última actualización' })
    updatedAt: Date;

    static fromEntity(entity: Order): CreateOrderResultDTO {
        const dto = new CreateOrderResultDTO();
        dto.id = entity.get().id;
        dto.clientName = entity.get().clientName;
        dto.status = entity.get().status;
        dto.createdAt = entity.get().createdAt;
        dto.updatedAt = entity.get().updatedAt;
        dto.items = entity.get().items?.map((item) => CreateItemResultDTO.fromEntity(item));
        return dto;
    }
}
