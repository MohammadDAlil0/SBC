import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/core/models';
import { Repository } from 'typeorm';
import { CreateUserDto, LoginDto } from './dto';
import { EmailService } from 'src/core/utils';
import { getPasswordResetTemplate } from 'src/core/constants';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    private readonly config: ConfigService,
    private readonly jwt: JwtService,
    private readonly emailService: EmailService,
    private readonly configService: ConfigService,
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
        email: loginDto.email,
      },
      select: ['id', 'firstName', 'lastName', 'email', 'password'],
    });

    if (!(await user.validatePassword(loginDto.password))) {
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

  async forgotPassword(email: string) {
    const user = await this.usersRepository.findOneOrFail({
      where: { email },
    });

    const resetToken = await this.getToken(user.id, user.email);
    const resetUrl = `${this.configService.get('FRONTEND_URL')}/reset-password?token=${resetToken}`;

    await this.emailService.sendMail({
      to: email,
      subject: 'Password Reset Request',
      html: getPasswordResetTemplate(user.firstName, resetUrl),
    });
  }

  async resetPassword(token: string, password: string) {
    const email = await this.decodeConfirmationToken(token);

    const user = await this.usersRepository
    .createQueryBuilder('user')
    .where('user.email = :email', { email })
    .addSelect('user.password')
    .getOneOrFail();

    user.password = password;
    return await user.save();
  }

  async decodeConfirmationToken(token: string) {
    try {
        const payload = await this.jwt.verify(token, {
            secret: this.configService.get('JWT_SECRET')
        });

        if (typeof payload === 'object' && 'email' in payload) {
            return payload.email;
        }
        throw new BadRequestException();
    } catch (error) {
        if (error?.name === 'TokenExpiredError') {
            throw new BadRequestException(
                'Email confirmation token expired'
            );
        }
        throw new BadRequestException('Bad confirmation token');
    }
}
}
