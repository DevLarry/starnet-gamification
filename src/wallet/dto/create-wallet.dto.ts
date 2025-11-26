import { ApiProperty } from "@nestjs/swagger";

export class CreateWalletDto {
    @ApiProperty()
    address: string;
}
