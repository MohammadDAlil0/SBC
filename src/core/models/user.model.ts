import { 
    Entity, 
    Column, 
    Index,
    BeforeInsert,
    BeforeUpdate,
    OneToMany,
} from 'typeorm';
import { ChatSession } from './chatSession.model';
import { BaseModel } from './base.mode';
import * as argon from 'argon2';

@Entity()
export class User  extends BaseModel{
    @Column({ length: 50 })
    firstName: string;

    @Column({ length: 50 })
    lastName: string;

    @Index({ unique: true })
    @Column({ length: 100 })
    email: string;

    @Column({ select: false }) // Password won't be selected by default in queries
    password: string;

    @Column({ length: 100, nullable: true })
    company: string;
    
    @Column({ length: 20, nullable: true })
    phone: string;

    @Column({ length: 50 })
    country: string;

    @Column({ length: 50, nullable: true })
    timezone: string;

    @OneToMany(() => ChatSession, chatSession => chatSession.user)
    chatSessions: ChatSession[];

    // Hash password before inserting
    @BeforeInsert()
    @BeforeUpdate()
    async hashPassword() {
        if (this.password) {
            this.password = await argon.hash(this.password);
        }
    }

    // Method to validate password
    async validatePassword(password: string): Promise<boolean> {
        return await argon.verify(this.password, password);
    }
}