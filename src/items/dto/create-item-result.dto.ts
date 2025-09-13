import { ApiProperty } from "@nestjs/swagger";
import { Item } from "../entities/item.entity";

export class CreateItemResultDTO {
    @ApiProperty({ example: 1, description: 'ID único del ítem' })
    id: number;
    
    @ApiProperty({ example: 'Café en grano', description: 'Descripción del producto' })
    description: string;

    @ApiProperty({ example: 2, description: 'Cantidad solicitada' })
    quantity: number;

    @ApiProperty({ example: 450, description: 'Precio unitario en moneda local' })
    unitPrice: number;

    static fromEntity(entity: Item): CreateItemResultDTO {
        const dto = new CreateItemResultDTO();
        dto.id = entity.get().id;
        dto.description = entity.get().description;
        dto.quantity = entity.get().quantity;
        dto.unitPrice = entity.get().unitPrice;
        return dto;
    }
}