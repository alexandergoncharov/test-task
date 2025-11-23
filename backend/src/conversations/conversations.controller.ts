import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ConversationsService } from './conversations.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';

@Controller('conversations')
@UseGuards(JwtAuthGuard)
export class ConversationsController {
  constructor(private readonly conversationsService: ConversationsService) {}

  @Get()
  async findAll(@GetUser() user: { id: string }) {
    return this.conversationsService.findAll(user.id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @GetUser() user: { id: string },
    @Body() createConversationDto: CreateConversationDto,
  ) {
    return this.conversationsService.create(user.id, createConversationDto);
  }
}
