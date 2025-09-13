import { GetItemResultDTO } from "src/items/dto/get-item-result.dto";
import { Order } from "../entities/order.entity";
import { ApiProperty } from "@nestjs/swagger";

export class GetOrderResultDTO {
    @ApiProperty({ example: 1, description: 'ID único del pedido' })
    id: number;

    @ApiProperty({ example: 'Juan Pérez', description: 'Nombre del cliente' })
    clientName: string;

    @ApiProperty({ example: 'sent', description: 'Estado actual del pedido' })
    status: string;

    @ApiProperty({ type: [GetItemResultDTO], description: 'Listado de ítems del pedido' })
    items: GetItemResultDTO[];

    @ApiProperty({ example: '2025-09-12T21:00:00.000Z', description: 'Fecha de creación' })
    createdAt: Date;

    @ApiProperty({ example: '2025-09-12T21:00:00.000Z', description: 'Fecha de última actualización' })
    updatedAt: Date;

    static fromEntity(entity: Order): GetOrderResultDTO {
        const dto = new GetOrderResultDTO();
        dto.id = entity.get().id;
        dto.clientName = entity.get().clientName;
        dto.status = entity.get().status;
        dto.createdAt = entity.get().createdAt;
        dto.updatedAt = entity.get().updatedAt;
        dto.items = entity.get().items?.map((item) => GetItemResultDTO.fromEntity(item));
        return dto;
    }
}