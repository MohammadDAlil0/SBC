import { 
    Entity, 
    Column, 
    OneToMany,
} from 'typeorm';
import { ChatSession } from './chatSession.model';
import { BaseModel } from './base.mode';

@Entity()
export class Code  extends BaseModel{
    @Column({ length: 50 })
    name: string;

    @Column({ length: 200 })
    description: string;

    @Column({ length: 400 })
    bookUrl: string;

    @Column({length: 50})
    collectionName: string;

    @Column({ length: 400, nullable: true})
    photoUrl: string;

    @OneToMany(() => ChatSession, chatSession => chatSession.code)
    chatSessions: ChatSession[];
}