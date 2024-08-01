import { CreateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

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