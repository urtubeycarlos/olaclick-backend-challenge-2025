import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt } from 'class-validator';

export class CreateItemDTO {
    @ApiProperty({
        example: 'Café en grano',
        description: 'Descripción del producto',
    })
    @IsString()
    description: string;

    @ApiProperty({
        example: 2,
        description: 'Cantidad solicitada del producto',
    })
    @IsInt()
    quantity: number;

    @ApiProperty({
        example: 450,
        description: 'Precio unitario en moneda local',
    })
    @IsInt()
    unitPrice: number;
}
