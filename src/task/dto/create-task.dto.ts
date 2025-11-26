import { ApiProperty } from "@nestjs/swagger";

export class CreateTaskDto {
    @ApiProperty()
    title: string;
    @ApiProperty({ required: false })
    description?: string;
    @ApiProperty({ required: false })
    icon?: string;
    @ApiProperty()
    url: string;
    @ApiProperty({default: 0})
    pointValue: number;
}
