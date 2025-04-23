import { Injectable, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UUID } from "crypto";
import { Repository } from "typeorm";
import { User } from "../models";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class JWTStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(config: ConfigService,  @InjectRepository(User) private readonly usersRepository: Repository<User>,) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: config.getOrThrow<string>('JWT_SECRET')
        });
    }

    async validate(payload: {
        sub: UUID,
        email: string
    }) {
        const user = this.usersRepository.findOne({
            where: {
                id: payload.sub
            }
        })

        if (!user) {
            throw new NotFoundException('User not found')
        }
        return user;
    }
}