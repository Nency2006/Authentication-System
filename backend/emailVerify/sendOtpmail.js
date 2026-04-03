import nodemailer from "nodemailer";
import 'dotenv/config';

export const sendOtpMail = async (email, otp) => {

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth : {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        })
        const mailoptions = {
            from : process.env.EMAIL_USER,
            to: email,
            subject: "OTP for password reset",
            html: `<p>Your OTP for password reset is: <b>${otp}</b>. it is valid for 10 minutes.</p>`

        }
        await transporter.sendMail(mailoptions);
 
}