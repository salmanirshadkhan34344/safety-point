import * as nodemailer from 'nodemailer';

export class EmailHelper {
  static async sendOtpEmail (email: string, otp: any) {
    try {
      let transporter = nodemailer.createTransport({
        host: 'mail.gologonow.app',
        port: 465,
        secure: true,
        auth: {
          user: 'testing@gologonow.app',
          pass: '87kkzX6F66w1',
        },
      });

      const mailOptions = {
        from: 'testing@gologonow.app',
        to: email,
        subject: 'OTP Verification',
        html: `<p>Your OTP is  ${otp} </p>`,
      };
      await transporter.sendMail(mailOptions);
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }


  
}