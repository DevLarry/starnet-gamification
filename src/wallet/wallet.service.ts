import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import axios from 'axios';
import { PrismaService } from '../prisma.service';

@Injectable()
export class WalletService {
  constructor(private prismaService: PrismaService) {}

  async create(userId: string,createWalletDto: CreateWalletDto) {
    const is_valid_address = (await this.verifyWallet(createWalletDto.address))
      .ok;
    if (!is_valid_address) {
      throw new NotFoundException('Invalid wallet address');
    }

    const updateResult = await this.prismaService.user.update({
      where: { id: userId },
      data: {walletAddress: createWalletDto.address},
    });

    if (!updateResult) {
      throw new InternalServerErrorException('No logged in user found');
    }

    return { message: 'Wallet address is valid', status: 'success', ok: true };
  }

  async verifyWallet(address: string) {
    const response = await axios.get(
      `${process.env.TON_API_URL}/packAddress?address=${address}`,
    );

    return response.data;
  }

}
