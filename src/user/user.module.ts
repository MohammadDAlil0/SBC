import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/core/models';
import { JwtModule } from '@nestjs/jwt';
import { EmailService } from 'src/core/utils';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({}),
  ],
  controllers: [UserController],
  providers: [UserService, EmailService]
})
export class UserModule {}
