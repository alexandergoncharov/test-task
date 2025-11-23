import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../entities/user.entity';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async register(
    registerDto: RegisterDto,
  ): Promise<{ id: string; email: string; username: string }> {
    const { email, username, password } = registerDto;

    // Check if user with email already exists
    const existingUserByEmail = await this.userRepository.findOne({
      where: { email },
    });

    if (existingUserByEmail) {
      throw new ConflictException('User with this email already exists');
    }

    // Check if user with username already exists
    const existingUserByUsername = await this.userRepository.findOne({
      where: { username },
    });

    if (existingUserByUsername) {
      throw new ConflictException('User with this username already exists');
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user
    try {
      const user = this.userRepository.create({
        email,
        username,
        password: hashedPassword,
      });

      const savedUser = await this.userRepository.save(user);

      // Return user without password
      return {
        id: savedUser.id,
        email: savedUser.email,
        username: savedUser.username,
      };
    } catch (error) {
      throw new InternalServerErrorException('Failed to create user');
    }
  }
}
