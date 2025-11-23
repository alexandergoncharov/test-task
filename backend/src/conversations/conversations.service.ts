import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Conversation } from '../entities/conversation.entity';
import { CreateConversationDto } from './dto/create-conversation.dto';

@Injectable()
export class ConversationsService {
  constructor(
    @InjectRepository(Conversation)
    private conversationRepository: Repository<Conversation>,
  ) {}

  async findAll(userId: string): Promise<
    Array<{
      id: string;
      participants: string[];
      createdAt: Date;
      updatedAt: Date;
    }>
  > {
    const conversations = await this.conversationRepository
      .createQueryBuilder('conversation')
      .where('conversation.participants LIKE :userId', {
        userId: `%${userId}%`,
      })
      .orderBy('conversation.updatedAt', 'DESC')
      .getMany();

    return conversations.map((conversation) => ({
      id: conversation.id,
      participants: conversation.participants,
      createdAt: conversation.createdAt,
      updatedAt: conversation.updatedAt,
    }));
  }

  async create(
    userId: string,
    createConversationDto: CreateConversationDto,
  ): Promise<{
    id: string;
    participants: string[];
    createdAt: Date;
    updatedAt: Date;
  }> {
    const { participantId } = createConversationDto;

    if (userId === participantId) {
      throw new ConflictException('Cannot create conversation with yourself');
    }

    // Check if conversation already exists between these two users
    const existingConversation = await this.conversationRepository
      .createQueryBuilder('conversation')
      .where('conversation.participants LIKE :userId', {
        userId: `%${userId}%`,
      })
      .andWhere('conversation.participants LIKE :participantId', {
        participantId: `%${participantId}%`,
      })
      .getOne();

    if (existingConversation) {
      return {
        id: existingConversation.id,
        participants: existingConversation.participants,
        createdAt: existingConversation.createdAt,
        updatedAt: existingConversation.updatedAt,
      };
    }

    // Create new conversation
    const conversation = this.conversationRepository.create({
      participants: [userId, participantId],
    });

    const savedConversation =
      await this.conversationRepository.save(conversation);

    return {
      id: savedConversation.id,
      participants: savedConversation.participants,
      createdAt: savedConversation.createdAt,
      updatedAt: savedConversation.updatedAt,
    };
  }

  async findOne(
    conversationId: string,
    userId: string,
  ): Promise<{
    id: string;
    participants: string[];
    createdAt: Date;
    updatedAt: Date;
  } | null> {
    const conversation = await this.conversationRepository.findOne({
      where: { id: conversationId },
    });

    if (!conversation) {
      return null;
    }

    // Check if user is a participant
    if (!conversation.participants.includes(userId)) {
      return null;
    }

    return {
      id: conversation.id,
      participants: conversation.participants,
      createdAt: conversation.createdAt,
      updatedAt: conversation.updatedAt,
    };
  }
}
