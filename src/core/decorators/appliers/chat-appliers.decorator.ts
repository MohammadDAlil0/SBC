import { applyDecorators, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { JwtGuard } from "src/core/guards";

export function StartChatDecorator() {
    return applyDecorators(
        ApiOperation({ summary: 'Start New Chat' }),
        ApiResponse({ status: 200, description: 'You will get a message' }),
        ApiBearerAuth(),
        UseGuards(JwtGuard),
    )
}

export function GetChatMessagesDecorator() {
    return applyDecorators(
        ApiOperation({ summary: 'Get Chat Messages' }),
        ApiResponse({ status: 200, description: 'You will get all the messages' }),
        ApiBearerAuth(),
        UseGuards(JwtGuard),
    )
}

export function GetUserChatsDecorator() {
    return applyDecorators(
        ApiOperation({ summary: 'Get User Chats' }),
        ApiResponse({ status: 200, description: 'You will get a list of chats' }),
        ApiBearerAuth(),
        UseGuards(JwtGuard),
    )
}

export function AskQuestionDecorator() {
    return applyDecorators(
        ApiOperation({ summary: 'Ask Question' }),
        ApiResponse({ status: 200, description: 'You will get the answer of your question' }),
        ApiBearerAuth(),
        UseGuards(JwtGuard),
    )
}