import { CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class AbstractEntity<T> {
    @PrimaryGeneratedColumn()
    id: number

    @CreateDateColumn()
    created_at: Date

    @UpdateDateColumn()
    update_at: Date

    @DeleteDateColumn()
    deleted_at: Date
    constructor(entity: Partial<T>) {
        Object.assign(this, entity)
    }
}