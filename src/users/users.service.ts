import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {

  constructor(private readonly usersRepository: UsersRepository) {}

  async create(createUserDto: CreateUserDto) {
    const { email } = createUserDto;
    const user = await this.usersRepository.getUserByEmail(email);

    if (user) throw new ConflictException('Email already been used.');

    return await this.usersRepository.create(createUserDto);
  }

  async getUserByEmail(email: string) {
    const user = await this.usersRepository.getUserByEmail(email)
    return user;
  }

  async findOne(id: number) {
    const user = await this.usersRepository.findOne(id);
    if(!user) throw new NotFoundException("User not found.")
    return user;
  }

}
