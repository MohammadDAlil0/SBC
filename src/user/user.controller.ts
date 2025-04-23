import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, LoginDto } from './dto';
import { LoginDecorators, SignupDecorators } from 'src/core/decorators/appliers';

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
}
