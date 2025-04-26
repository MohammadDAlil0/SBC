import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { ChatSession, Code, Message, User } from 'src/core/models';

@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        const nodeEnv = configService.getOrThrow('NODE_ENV');
        return {
          type: 'mysql',
          host: configService.getOrThrow(`DATA_BASE_HOST_${nodeEnv}`),
          port: parseInt(configService.getOrThrow(`DATA_BASE_PORT_${nodeEnv}`), 10),
          username: configService.getOrThrow(`DATA_BASE_USERNAME_${nodeEnv}`),
          password: configService.getOrThrow(`DATA_BASE_PASSWORD_${nodeEnv}`),
          database: configService.getOrThrow(`DATA_BASE_NAME_${nodeEnv}`),
          // synchronize: true,
          // dropSchema: true,
          // logging: configService.getOrThrow(`DATA_BASE_LOGGING_${nodeEnv}`) === 'true',
          entities: [User, Message, Code, ChatSession]
        };
      },
      
      inject: [ConfigService],
    }),
  ],
  providers: [],
  exports: [],
})
export class DatabaseModule {}