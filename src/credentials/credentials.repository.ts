import { Injectable } from '@nestjs/common';
import { CreateCredentialDto } from './dto/create-credential.dto';
import { UpdateCredentialDto } from './dto/update-credential.dto';
import { PrismaService } from '../prisma/prisma.service';
const Cryptr = require('cryptr');

@Injectable()
export class CredentialsRepository {
  constructor(private readonly prisma: PrismaService) {}
  cryptr = new Cryptr('MyTotallySecretKey');

  create(credential: CreateCredentialDto, userId: number) {
    return this.prisma.credentials.create({
      data: {
        ...credential,
        password: this.cryptr.encrypt(credential.password),
        userId,
      },
    });
  }

  async findAll(id: number) {
    const cryptr = new Cryptr('myTotallySecretKey');

    const credentials = await this.prisma.credentials.findMany({
      where: {
        userId: id,
      },
    });

    // decrypt
    // findMany retorna um array de objetos
    const decryptCred = credentials.map((cred) => {
      return {
        ...cred,
        password: cryptr.decrypt(cred.password),
      };
    });
  }

  getCredentialByLabel(lable: string, id: number) {
    return this.prisma.credentials.findFirst({
      where: {
        label: lable,
        userId: id,
      },
    });
  }

  findOne(id: number) {
    return this.prisma.credentials.findUnique({
      where: { id },
    });
  }

  remove(id: number) {
    return this.prisma.credentials.delete({
      where: {
        id,
      },
    });
  }
}
