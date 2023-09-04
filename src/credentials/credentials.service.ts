import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCredentialDto } from './dto/create-credential.dto';
import { UpdateCredentialDto } from './dto/update-credential.dto';
import { User } from '@prisma/client';
import { CredentialsRepository } from './credentials.repository';

@Injectable()
export class CredentialsService {
  constructor(private readonly credentialsRepository: CredentialsRepository) {}

  async create(user: User, credential: CreateCredentialDto) {
    const { label, name, password, url } = credential;
    const { id } = user;

    if (!label || name || password || url)
      throw new BadRequestException('One or more fields are empty or invalid');

    const checkValidLabel =
      await this.credentialsRepository.getCredentialByLabel(label, id);

    if (checkValidLabel)
      throw new ConflictException(
        'The label you are trying to create already exists.',
      );

    return this.credentialsRepository.create(credential, user.id);
  }

  async findAll(user: User) {
    const { id } = user;
    return await this.credentialsRepository.findAll(id);
  }

  async findOne(id: number, userId: number) {
    const checkCredential = await this.credentialsRepository.findOne(id);
    if (!checkCredential) throw new NotFoundException('Credential not found.');
    if (checkCredential.userId !== userId)
      throw new ForbiddenException(
        'Users cant acces credentials that dont belong to themselves.',
      );
    
      return checkCredential;
  }

  async remove(id: number, userId: number) {
    const checkCredential = await this.credentialsRepository.findOne(id);
    if (!checkCredential) throw new NotFoundException('Credential not found.');
    if (checkCredential.userId !== userId)
    throw new ForbiddenException(
      'Users cant delete credentials that dont belong to themselves.',
    );

    return this.credentialsRepository.remove(id);
  }

  async removeUser(userId: number){
    return await this.credentialsRepository.removeUser(userId);
  }
}
