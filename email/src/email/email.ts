import { BadRequestError } from '@mrshahabtickets/common';
import nodemailer from 'nodemailer';

interface Mail {
  to: string;
  subject: string;
  text: string;
}

class MailService {
  private static instance: MailService;
  private transporter!: nodemailer.Transporter;

  private constructor() {}

  static getInstance() {
    if (!MailService.instance) {
      MailService.instance = new MailService();
    }
    return MailService.instance;
  }

  async createConnection() {
    this.transporter = nodemailer.createTransport({
      sendmail: true,
      newline: 'unix',
      path: '/usr/sbin/sendmail',
    });
  }

  async sendMail(options: Mail) {
    return await this.transporter.sendMail(
      {
        from: 'shahabnamvar37@gmail.com',
        to: options.to,
        subject: options.subject,
        text: options.text,
      },
      (err, info) => {
        console.log(info.envelope);
        console.log(info.messageId);
        if (err) {
          throw new BadRequestError('error in send email');
        }
      }
    );
  }
}
export { MailService };
