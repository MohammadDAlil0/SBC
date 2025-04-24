import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, LoginDto, UserEmailDto, UserPasswordDto } from './dto';
import { ForgotPasswordDecorators, GetMeDecorators, LoginDecorators, ResetPasswordDecorators, SignupDecorators } from 'src/core/decorators/appliers';
import { GetUser } from 'src/core/decorators/auth';
import { User } from 'src/core/models';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post('signup')
    @SignupDecorators()
    singup(@Body() createUserDto: CreateUserDto) {
        return this.userService.signup(createUserDto);
    }

    @Post('login')
    @LoginDecorators()
    login(@Body() dto: LoginDto) {
        return this.userService.login(dto); 
    }

    @Patch('forgot-password')
    @ForgotPasswordDecorators()
    async forgotPassword(@Body() userEmailDto: UserEmailDto) {
        return this.userService.forgotPassword(userEmailDto.email);
    }

    @Patch('reset-password/:token')
    @ResetPasswordDecorators()
    async resetPassword(@Body() userPasswordDto: UserPasswordDto, @Param('token') token: string) {
        return this.userService.resetPassword(token, userPasswordDto.password);
    }

    @Get('me')
    @GetMeDecorators()
    async getMe(@GetUser() curUser: User) {
        return curUser;
    }
}
