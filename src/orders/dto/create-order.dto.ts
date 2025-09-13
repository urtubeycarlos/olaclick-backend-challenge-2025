import { IsString, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateItemDTO } from 'src/items/dto/create-item.dto';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderDTO {
    @ApiProperty({
        example: 'Juan Pérez',
        description: 'Nombre del cliente que realiza el pedido',
    })
    @IsString()
    clientName: string;

    @ApiProperty({
        type: [CreateItemDTO],
        description: 'Listado de ítems que forman parte del pedido',
        example: [
            {
                description: 'Café en grano',
                quantity: 2,
                unitPrice: 450,
            },
            {
                description: 'Filtro de papel',
                quantity: 1,
                unitPrice: 120,
            },
        ],
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateItemDTO)
    items: CreateItemDTO[];
}

