import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import databaseConfig from './config/database.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mongodb',
        url: configService.get<string>('database.url'),
        database: configService.get<string>('database.database'),
        useNewUrlParser: true,
        useUnifiedTopology: true,
        synchronize: configService.get<boolean>('database.synchronize'),
        logging: configService.get<boolean>('database.logging'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
      }),
      inject: [ConfigService],
    }),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
