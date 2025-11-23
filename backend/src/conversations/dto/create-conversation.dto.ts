import { IsString, IsNotEmpty } from 'class-validator';

export class CreateConversationDto {
  @IsString()
  @IsNotEmpty({ message: 'Participant ID is required' })
  participantId: string;
}
