import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateConversationDto {
  @ApiProperty({
    example: '507f1f77bcf86cd799439011',
    description: 'ID of the user to start conversation with',
  })
  @IsString()
  @IsNotEmpty({ message: 'Participant ID is required' })
  participantId: string;
}
