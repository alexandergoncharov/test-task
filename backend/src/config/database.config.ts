import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  type: 'mongodb',
  url: process.env.MONGODB_URI || 'mongodb://localhost:27017',
  database: process.env.MONGODB_DATABASE || 'chat_app',
  useNewUrlParser: true,
  useUnifiedTopology: true,
  synchronize: true,
  logging: true,
}));
