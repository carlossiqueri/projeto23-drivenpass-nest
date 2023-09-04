import { Injectable } from '@nestjs/common';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { PrismaService } from '../prisma/prisma.service';
const Cryptr = require('cryptr');

@Injectable()
export class CardsRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(card: CreateCardDto, userId: number) {
    const cryptr = new Cryptr('myTotallySecretKey');

    return this.prisma.card.create({
      data: {
        ...card,
        cardPassword: cryptr.encrypt(card.cardPassword),
        cvv: cryptr.encrypt(card.cvv),
        userId,
      },
    });
  }

  async findAll(userId: number) {
    const cryptr = new Cryptr('myTotallySecretKey');
    const cards = await this.prisma.card.findMany({
      where: { userId },
    });

    const decryptedCards = cards.map((card) => {
      return {
        ...card,
        cvv: cryptr.decrypt(card.cvv),
        cardPassword: cryptr.decrypt(card.cardPassword),
      };
    });

    return decryptedCards;
  }

  async findOne(id: number) {
    const cryptr = new Cryptr('myTotallySecretKey');
    const cards = await this.prisma.card.findFirst({
      where: { id },
    });

    return {
      ...cards,
      cvv: cryptr.decrypt(cards.cvv),
      cardPassword: cryptr.decrypt(cards.cardPassword),
    };
  }

  findByCardLabel(cardLabel: string) {
    return this.prisma.card.findFirst({
      where: { cardLabel },
    });
  }

  remove(id: number) {
    return this.prisma.card.delete({
      where: { id },
    });
  }
}
