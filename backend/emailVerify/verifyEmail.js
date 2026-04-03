import nodemailer from 'nodemailer';
import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import handlebars from 'handlebars';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


export const verifyEmail = async(token, email)=>{

    const emailTemplateSource = fs.readFileSync(
        path.join(__dirname, "template.hbs"), "utf-8"
        
    );

    const Template = handlebars.compile(emailTemplateSource);
    const htmlToSend = Template({ token: encodeURIComponent(token) });

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth : {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    })
    const mailConfigration = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Email verification",
        html: htmlToSend,
    }
    transporter.sendMail(mailConfigration, function(err, info){
        if(err){
            throw new Error(err);
        }
        console.log("email sed");
        console.log(info); 
    })
}