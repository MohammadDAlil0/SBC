import { 
    Entity, 
    Column, 
    ManyToOne,
    JoinColumn, 
} from 'typeorm';
import { ChatSession } from './chatSession.model';
import { BaseModel } from './base.mode';

@Entity()
export class Message  extends BaseModel{
    @Column('text')
    content: string;

    @Column()
    fromUser: boolean;

    @ManyToOne(() => ChatSession, chatSession => chatSession.messages)
    @JoinColumn()
    chatSession: ChatSession;
}