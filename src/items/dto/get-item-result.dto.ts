import { ApiProperty } from "@nestjs/swagger";
import { Item } from "../entities/item.entity";

export class GetItemResultDTO {
    @ApiProperty({ example: 1, description: 'ID único del ítem' })
    id: number;

    @ApiProperty({ example: 'Filtro de papel', description: 'Descripción del producto' })
    description: string;

    @ApiProperty({ example: 1, description: 'Cantidad solicitada' })
    quantity: number;

    @ApiProperty({ example: 120, description: 'Precio unitario en moneda local' })
    unitPrice: number;

    static fromEntity(entity: Item): GetItemResultDTO {
        const dto = new GetItemResultDTO();
        dto.id = entity.get().id;
        dto.description = entity.get().description;
        dto.quantity = entity.get().quantity;
        dto.unitPrice = entity.get().unitPrice;
        return dto;
    }
}