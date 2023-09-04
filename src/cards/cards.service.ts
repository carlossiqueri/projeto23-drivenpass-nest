import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { User } from '@prisma/client';
import { CardsRepository } from './cards.repository';

@Injectable()
export class CardsService {
  constructor(private readonly cardsRepository: CardsRepository) {}

  async create(card: CreateCardDto, user: User) {
    const userId = user.id;
    const {
      cardLabel,
      cardNumber,
      cardName,
      cvv,
      expireDate,
      cardPassword,
      virtual,
      type,
    } = card;

    if (
      !cardNumber ||
      !cardName ||
      !cvv ||
      !expireDate ||
      !cardPassword ||
      !virtual ||
      !type ||
      !cardLabel
    )
      throw new BadRequestException();

    const checkCardLabel =
      await this.cardsRepository.findByCardLabel(cardLabel);
    if (checkCardLabel)
      throw new ConflictException(
        'The label you are trying to create already exists.',
      );

    return this.cardsRepository.create(card, userId);
  }

  async findAll(user: User) {
    const userId = user.id;
    return await this.cardsRepository.findAll(userId);
  }

  async findOne(id: number, user: User) {
    const userId = user.id

    const checkCard = await this.cardsRepository.findOne(id);
    if (!checkCard) throw new NotFoundException('Credential not found.');
    if (checkCard.userId !== userId)
      throw new ForbiddenException(
        'Users cant access cards that dont belong to themselves.',
      );
    
      return checkCard;
  }

  async remove(id: number, user: User) {
    const userId = user.id

    const checkCard = await this.cardsRepository.findOne(id);
    if (!checkCard) throw new NotFoundException('Credential not found.');
    if (checkCard.userId !== userId)
      throw new ForbiddenException(
        'Users cant access cards that dont belong to themselves.',
      );
    
      return this.cardsRepository.remove(id);
  }

  async removeUser(userId: number){
    return await this.cardsRepository.removeUser(userId);
  }
}
