import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<
    Array<{ id: string; email: string; username: string; createdAt: Date }>
  > {
    const users = await this.userRepository.find({
      select: ['id', 'email', 'username', 'createdAt'],
    });

    return users.map((user) => ({
      id: user.id,
      email: user.email,
      username: user.username,
      createdAt: user.createdAt,
    }));
  }

  async findOne(id: string): Promise<{
    id: string;
    email: string;
    username: string;
    createdAt: Date;
  } | null> {
    const user = await this.userRepository.findOne({
      where: { id },
      select: ['id', 'email', 'username', 'createdAt'],
    });

    if (!user) {
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      username: user.username,
      createdAt: user.createdAt,
    };
  }
}
