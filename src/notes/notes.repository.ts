import { Injectable } from '@nestjs/common';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NotesRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(label: string, note: string, userId: number) {
    return this.prisma.note.create({
      data: {
        label,
        note,
        userId,
      },
    });
  }

  findAll(userId: number) {
    return `This action returns all notes`;
  }

  findOne(id: number) {
    return this.prisma.note.findUnique({
      where: { id },
    });
  }

  findNoteByLabel(label: string) {
    return this.prisma.note.findFirst({
      where: { label },
    });
  }

  remove(id: number) {
    return this.prisma.note.delete({
      where: { id },
    });
  }
}
