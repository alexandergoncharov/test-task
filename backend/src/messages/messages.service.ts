import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from '../entities/message.entity';
import { Conversation } from '../entities/conversation.entity';
import { CreateMessageDto } from './dto/create-message.dto';
import { MessagesGateway } from './messages.gateway';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
    @InjectRepository(Conversation)
    private conversationRepository: Repository<Conversation>,
    @Inject(forwardRef(() => MessagesGateway))
    private messagesGateway: MessagesGateway,
  ) {}

  async findAll(
    conversationId: string,
    userId: string,
  ): Promise<
    Array<{
      id: string;
      conversationId: string;
      senderId: string;
      content: string;
      createdAt: Date;
    }>
  > {
    await this.verifyConversationAccess(conversationId, userId);

    const messages = await this.messageRepository.find({
      where: { conversationId },
      order: {
        createdAt: 'ASC',
      },
    });

    return messages.map((message) => ({
      id: message.id,
      conversationId: message.conversationId,
      senderId: message.senderId,
      content: message.content,
      createdAt: message.createdAt,
    }));
  }

  async create(
    userId: string,
    createMessageDto: CreateMessageDto,
  ): Promise<{
    id: string;
    conversationId: string;
    senderId: string;
    content: string;
    createdAt: Date;
  }> {
    const { conversationId, content } = createMessageDto;

    const conversation = await this.verifyConversationAccess(
      conversationId,
      userId,
    );

    const message = this.messageRepository.create({
      conversationId,
      senderId: userId,
      content,
    });

    const savedMessage = await this.messageRepository.save(message);

    conversation.updatedAt = new Date();
    await this.conversationRepository.save(conversation);

    const messageData = {
      id: savedMessage.id,
      conversationId: savedMessage.conversationId,
      senderId: savedMessage.senderId,
      content: savedMessage.content,
      createdAt: savedMessage.createdAt,
    };

    // Broadcast message via WebSocket
    this.messagesGateway.broadcastMessage(conversationId, messageData);

    return messageData;
  }

  private async verifyConversationAccess(
    conversationId: string,
    userId: string,
  ): Promise<Conversation> {
    const conversation = await this.conversationRepository.findOne({
      where: { id: conversationId },
    });

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    if (!conversation.participants.includes(userId)) {
      throw new ForbiddenException('Access denied to this conversation');
    }

    return conversation;
  }
}
