import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { User } from '@prisma/client';
import { NotesRepository } from './notes.repository';

@Injectable()
export class NotesService {
  constructor(private readonly notesRepository: NotesRepository) {}

  async create(CreateNoteDto: CreateNoteDto, user: User) {
    const userId = user.id;
    const { label, note } = CreateNoteDto;

    if (!label || !note) throw new BadRequestException();

    const checkLabel = await this.notesRepository.findNoteByLabel(label);
    if (checkLabel) throw new ConflictException('Label already beeing used');

    return this.notesRepository.create(label, note, userId);
  }

  findAll(user: User) {
    const userId = user.id;
    return this.notesRepository.findAll(userId);
  }

  async findOne(id: number, user: User) {
    const userId = user.id;

    const checkNote = await this.notesRepository.findOne(id);
    if (!checkNote) throw new NotFoundException('Note not found.');
    if (checkNote.userId !== userId)
      throw new ForbiddenException(
        'Users cant acces notes that dont belong to themselves.',
      );

    return checkNote;
  }

  async remove(id: number, user: User) {
    const userId = user.id;

    const checkNote = await this.notesRepository.findOne(id);
    if (!checkNote) throw new NotFoundException('Note not found.');
    if (checkNote.userId !== userId)
      throw new ForbiddenException(
        'Users cant delete notes that dont belong to themselves.',
      );

    return this.notesRepository.remove(id);
  }
}
