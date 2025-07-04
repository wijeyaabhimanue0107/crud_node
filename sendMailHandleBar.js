import nodemailer from 'nodemailer';
import hbs from 'nodemailer-express-handlebars';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

transporter.use('compile', hbs({
    viewEngine: {
        extName: '.hbs',
        partialsDir: path.resolve('./templates/'),
        defaultLayout: false,
    },
    viewPath: path.resolve('./templates/'),
    extName: '.hbs',
}));

async function sendEmailHandleBar(userName, email) {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Confirmation of Account Creation',
        template: 'template',
        context: {
            userName: userName,
            loginUrl: 'https://yourdomain.com/login',
        },
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Message sent:", info.messageId);
}

export { sendEmailHandleBar };