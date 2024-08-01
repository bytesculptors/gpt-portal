import { Column, Entity, ManyToMany, ManyToOne } from "typeorm";
import { AbstractEntity } from "../../abstract/abstract.entity";
import { User } from "../../user/entities/user.entity";

@Entity()
export class Thread extends AbstractEntity<Thread> {
    @Column()
    title: string

    @ManyToOne(() => User)
    creator: User

    @ManyToMany(() => User)
    members: User[]
}
