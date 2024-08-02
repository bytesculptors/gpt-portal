import { Injectable } from "@nestjs/common";
import * as nodemailer from 'nodemailer'

@Injectable()
export class EmailService {
    private transporter
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: 'thht200603@gmail.com',
                pass: 'fnax btua yfvr wona'
            }
        })
    }

    async sendVerificationEmail(email: string, token: string) {
        console.log(email);
        const verificationLink = `http://localhost:3000/user/verify-email?token=${token}`
        const mailOptions = {
            from: 'thht200603@gmail.com',
            to: email,
            subject: 'Email Verification',
            text: `Click on this link to verify your account ${verificationLink}`,
            html: `<p>Please verify your email by clicking on the following link: <a href="${verificationLink}">Verify Email</a></p>`
        }

        await this.transporter.sendMail(mailOptions)
        console.log('Email sent!');
    }
}