import { BadRequestException } from '@nestjs/common';
import { ObjectId } from 'mongodb';

export function toObjectId(id: string, fieldName?: string): ObjectId {
  try {
    return new ObjectId(id);
  } catch (error) {
    const field = fieldName ? `${fieldName} ` : '';
    throw new BadRequestException(`Invalid ${field}ID format`);
  }
}
