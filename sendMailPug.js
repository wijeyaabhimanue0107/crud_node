import { createTransport } from "nodemailer";
import { compileFile } from "pug";
import path from "path";
import dotenv from 'dotenv';

dotenv.config();

async function sendEmailPug(first_name, email) {
    const templatePath = path.join(process.cwd(), "emailTemplate.pug");
    const compileFn = compileFile(templatePath);

    const htmlTemplate = compileFn({
        userName: first_name,
        loginUrl: "https://yourdomain.com/login",
    });

    const transporter = createTransport({
        host: "smtp.gmail.com",
        port: 465,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const info = await transporter.sendMail({
        to: email,
        subject: "Confirmation of Account Creation",
        html: htmlTemplate,
    });

    console.log("Message sent:", info.messageId);
}

export { sendEmailPug };
