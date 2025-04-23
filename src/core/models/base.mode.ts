import {
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    BaseEntity
} from 'typeorm';

export abstract class BaseModel extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @CreateDateColumn({
        name: 'createdAt',
        type: 'timestamp', // MySQL compatible type
        precision: 0, // No fractional seconds
        default: () => 'CURRENT_TIMESTAMP',
    })
    createdAt: Date;

    @UpdateDateColumn({
        name: 'updatedAt',
        type: 'timestamp',
        precision: 0,
        default: () => 'CURRENT_TIMESTAMP',
        onUpdate: 'CURRENT_TIMESTAMP',
        select: false
    })
    updatedAt: Date;

    @DeleteDateColumn({
        name: 'deletedAt',
        type: 'timestamp',
        precision: 0,
        nullable: true, 
        select: false
    })
    deletedAt?: Date | null;
}