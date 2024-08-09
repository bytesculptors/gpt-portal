import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from "typeorm";
import { AbstractEntity } from "../../abstract/abstract.entity";
import { Thread } from "../../thread/entities/thread.entity";
import { User } from "../../user/entities/user.entity";

@Entity()
export class Message extends AbstractEntity<Message> {
    @Column()
    content: string

    @ManyToOne(() => Thread)
    thread: Thread

    @ManyToOne(() => User)
    sender: User

    @OneToOne(() => Message, { nullable: true })
    @JoinColumn()
    replyTo?: Message
}
