import { IsString, IsNotEmpty } from 'class-validator';

export class CreateMessageDto {
  @IsString()
  @IsNotEmpty({ message: 'Conversation ID is required' })
  conversationId: string;

  @IsString()
  @IsNotEmpty({ message: 'Message content is required' })
  content: string;
}
