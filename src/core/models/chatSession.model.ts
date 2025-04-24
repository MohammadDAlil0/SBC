import { 
    Entity, 
    Column, 
    ManyToOne,
    JoinColumn,
    OneToMany, 
} from 'typeorm';
import { User } from './user.model';
import { Code } from './code.model';
import { Message } from './message.model';
import { BaseModel } from './base.mode';

@Entity()
export class ChatSession extends BaseModel{
    @Column({ length: 50 })
    name: string;

    @ManyToOne(() => User, user => user.chatSessions)
    @JoinColumn()
    user: User;
    
    @ManyToOne(() => Code, code => code.chatSessions)
    @JoinColumn()
    code: User;

    @OneToMany(() => Message, message => message.chatSession, { onDelete: 'CASCADE' })
    messages: Message[];
}