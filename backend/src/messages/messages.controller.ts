import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';

@ApiTags('Messages')
@ApiBearerAuth('JWT-auth')
@Controller('messages')
@UseGuards(JwtAuthGuard)
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get(':conversationId')
  @ApiOperation({ summary: 'Get all messages in a conversation' })
  @ApiParam({
    name: 'conversationId',
    description: 'Conversation ID',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiResponse({
    status: 200,
    description: 'List of messages in the conversation',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Access denied to conversation' })
  @ApiResponse({ status: 404, description: 'Conversation not found' })
  async findAll(
    @Param('conversationId') conversationId: string,
    @GetUser() user: { id: string },
  ) {
    return this.messagesService.findAll(conversationId, user.id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Send a message' })
  @ApiBody({ type: CreateMessageDto })
  @ApiResponse({
    status: 201,
    description: 'Message sent successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Access denied to conversation' })
  @ApiResponse({ status: 404, description: 'Conversation not found' })
  async create(
    @GetUser() user: { id: string },
    @Body() createMessageDto: CreateMessageDto,
  ) {
    return this.messagesService.create(user.id, createMessageDto);
  }
}
