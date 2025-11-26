import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMessageDto {
  @ApiProperty({
    example: '507f1f77bcf86cd799439011',
    description: 'ID of the conversation',
  })
  @IsString()
  @IsNotEmpty({ message: 'Conversation ID is required' })
  conversationId: string;

  @ApiProperty({
    example: 'Hello, how are you?',
    description: 'Message content',
  })
  @IsString()
  @IsNotEmpty({ message: 'Message content is required' })
  content: string;
}
