import { IsEmail, MinLength } from "class-validator";
import { AbstractEntity } from "../../abstract/abstract.entity";
import { Column, Entity, JoinTable, ManyToMany, OneToMany } from "typeorm";
import { Role } from "../../role/role.enum";
import { Thread } from "../../thread/entities/thread.entity";
import { Message } from "../../message/entities/message.entity";

@Entity()
export class User extends AbstractEntity<User> {
    @Column({ unique: true })
    @IsEmail()
    email: string

    @Column({ unique: true })
    username: string

    @Column()
    @MinLength(4)
    password: string

    @Column({ default: false })
    isVerified: boolean

    @Column({ nullable: true })
    verificationToken: string;

    @Column({ type: 'enum', enum: Role })
    role: string

    @OneToMany(() => Thread, (thread) => thread.creator)
    @JoinTable()
    threadsCreated: Thread[]

    @ManyToMany(() => Thread, (thread) => thread.members)
    @JoinTable()
    threadsMember: Thread[]

}
