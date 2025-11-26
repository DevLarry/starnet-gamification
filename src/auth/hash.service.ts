import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class HashService {
    SaltOrRound = 10
    async createPasswordHash(password: string) {
        return await bcrypt.hash(password, this.SaltOrRound);
    }

    async verifyPassword(password, hash){
        return await bcrypt.compare(password, hash)
    }
}
