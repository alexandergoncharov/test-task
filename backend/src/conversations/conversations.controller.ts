import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { ConversationsService } from './conversations.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';

@ApiTags('Conversations')
@ApiBearerAuth('JWT-auth')
@Controller('conversations')
@UseGuards(JwtAuthGuard)
export class ConversationsController {
  constructor(private readonly conversationsService: ConversationsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all conversations for current user' })
  @ApiResponse({
    status: 200,
    description: 'List of user conversations',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findAll(@GetUser() user: { id: string }) {
    return this.conversationsService.findAll(user.id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new conversation' })
  @ApiBody({ type: CreateConversationDto })
  @ApiResponse({
    status: 201,
    description: 'Conversation created successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 409, description: 'Conversation already exists' })
  async create(
    @GetUser() user: { id: string },
    @Body() createConversationDto: CreateConversationDto,
  ) {
    return this.conversationsService.create(
      user.id.toString(),
      createConversationDto,
    );
  }
}
