import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from '../auth/guards/auth.guard';

@Controller('api/wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @ApiOperation({
    summary: 'Connect Wallet',
    description: 'Connect a wallet using the provided address.',
  })
  @ApiResponse({
    status: 200,
    description: 'Wallet successfully connected.',
  })
  @ApiResponse({
    status: 404,
    description: 'Invalid wallet address.',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error.',
  })
  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createWalletDto: CreateWalletDto, @Req() req) {
    return this.walletService.create(req.user.id, createWalletDto);
  }

  // @Get()
  // findAll() {
  //   return this.walletService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.walletService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateWalletDto: UpdateWalletDto) {
  //   return this.walletService.update(+id, updateWalletDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.walletService.remove(+id);
  // }
}
