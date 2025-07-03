import { createTransport } from "nodemailer";
import fs from "fs";
import { promisify } from "util";
import dotenv from 'dotenv';

dotenv.config();

const readFileAsync = promisify(fs.readFile);

async function sendEmail(first_name, email) {

    let htmlTemplate = await readFileAsync('./mailTemplate.html', 'utf-8');
    htmlTemplate = htmlTemplate
        .replace('{{userName}}', first_name)
        .replace('{{loginUrl}}', 'https://yourdomain.com/login');

    const transporter = createTransport({
        host: "smtp.gmail.com",
        port: 465,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    (async () => {
        const info = await transporter.sendMail({
            to: email,
            subject: "confirmation of account creation",
            html: htmlTemplate,
        });

        console.log("Message sent:", info.messageId);
    })();
}
export {sendEmail};