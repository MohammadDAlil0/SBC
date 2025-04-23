import {
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/core/models';
import { Repository } from 'typeorm';
import { CreateUserDto, LoginDto } from './dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    private readonly config: ConfigService,
    private readonly jwt: JwtService,
  ) {}

  async signup(createUserDto: CreateUserDto) {
    const user: User = this.usersRepository.create(createUserDto);
    await this.usersRepository.save(user);
    const access_token = await this.getToken(user.id, user.email);
    return {
      ...user,
      access_token,
    };
  }

  async login(loginDto: LoginDto) {
    const user: User = await this.usersRepository.findOneOrFail({
        where: {
            email: loginDto.email
        },
        select: ['id', 'firstName', 'lastName', 'email', 'password']
    });


    if (! await user.validatePassword(loginDto.password)) {
      throw new BadRequestException('Invalid Password');
    }

    const access_token = await this.getToken(user.id, user.email);
    return {
      ...user,
      access_token,
    };
  }

  async getToken(userId: string, email: string): Promise<string> {
    const payload = {
      sub: userId,
      email,
    };
    const token = await this.jwt.signAsync(payload, {
      expiresIn: this.config.getOrThrow<string>('JWT_EXPIRES_IN'),
      secret: this.config.getOrThrow<string>('JWT_SECRET'),
    });
    return token;
  }
}
