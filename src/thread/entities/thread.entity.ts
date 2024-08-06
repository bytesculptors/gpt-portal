import { Column, Entity, ManyToMany, ManyToOne, OneToMany } from "typeorm";
import { AbstractEntity } from "../../abstract/abstract.entity";
import { User } from "../../user/entities/user.entity";
import { Message } from "../../message/entities/message.entity";

@Entity()
export class Thread extends AbstractEntity<Thread> {
    @Column()
    title: string

    @Column({ nullable: true })
    context: string

    @ManyToOne(() => User, (user) => user.threadsCreated)
    creator: User

    @ManyToMany(() => User, (user) => user.threadsMember)
    members: User[]

    @OneToMany(() => Message, (message) => message.thread)
    messages: Message[]
}
