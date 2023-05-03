import { MailService } from '../../email/email';
import {
  Subjects,
  Listener,
  PaymentCreatedEvent,
} from '@mrshahabtickets/common';
import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queue-group-name';
import { Email } from '../../model/email';

const emailService = MailService.getInstance();

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: PaymentCreatedEvent['data'], msg: Message) {
    const options = {
      to: data.email,
      subject: 'payment in ticketing',
      text: 'your payment successfully',
    };
    emailService.sendMail(options);

    const email = Email.build({
      donePayment: true,
      orderId: data.orderId,
    });

    msg.ack();
  }
}
