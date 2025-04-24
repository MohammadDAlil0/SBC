import { applyDecorators, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { JwtGuard } from 'src/core/guards';

export function SignupDecorators() {
  return applyDecorators(
    ApiOperation({ summary: 'Signup A User' }),
    ApiResponse({ status: 201, description: 'You will get a user with an access-token' }),
  );
}

export function LoginDecorators() {
    return applyDecorators(
        ApiOperation({ summary: 'Login A User' }),
        ApiResponse({ status: 200, description: 'You will get a user with an access-token' }),
        HttpCode(200)
    );
}

export function ForgotPasswordDecorators() {
  return applyDecorators(
    ApiOperation({ summary: 'Forgot Your Password' }),
    ApiResponse({ status: HttpStatus.OK, description: 'You will receive a message. Check your mailbox.' }),
    HttpCode(HttpStatus.OK),
  );
}

export function ResetPasswordDecorators() {
  return applyDecorators(
    ApiOperation({ summary: 'Reset Your Password' }),
    ApiResponse({ status: HttpStatus.OK, description: 'You will get a message' }),
    HttpCode(HttpStatus.OK),
  );
}

export function GetMeDecorators() {
  return applyDecorators(
    ApiOperation({ summary: 'Get The Current User' }),
    ApiResponse({ status: HttpStatus.OK, description: 'You will get the current user' }),
    ApiBearerAuth(),
    UseGuards(JwtGuard),
  );
}

export function DeleteChatDecorator() {
  return applyDecorators(
    ApiOperation({ summary: 'Delete Chat' }),
    ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'You will not get any response' }),
    ApiBearerAuth(),
    UseGuards(JwtGuard),
  );
}