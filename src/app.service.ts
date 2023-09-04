import { Injectable, UnauthorizedException } from '@nestjs/common';
import { DeleteDto } from './users/dto/delete-user.dto';
import { User } from '@prisma/client';
import { CredentialsService } from './credentials/credentials.service';
import { NotesService } from './notes/notes.service';
import { CardsService } from './cards/cards.service';
import { UsersService } from './users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AppService {
  constructor(
    private readonly userService: UsersService,
    private readonly credentialsService: CredentialsService,
    private readonly notesService: NotesService,
    private readonly cardService: CardsService,
  ) {}

  getHealth(): string {
    return "I'm okay!";
  }

  async erase(deleteDto: DeleteDto, user: User) {
    const userId = user.id;
    const checkUser = await this.userService.findOne(userId);
    const verifyPass = await bcrypt.compare(
      checkUser.password,
      deleteDto.password,
    );

    if (!verifyPass) throw new UnauthorizedException();

    await this.credentialsService.removeUser(userId);
    await this.notesService.removeUser(userId);
    await this.cardService.removeUser(userId);
    return await this.userService.removeUser(userId);
  }
}
