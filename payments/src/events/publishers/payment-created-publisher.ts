import {
  Subjects,
  Publisher,
  PaymentCreatedEvent,
} from '@mrshahabtickets/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
  
}
