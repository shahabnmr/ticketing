import {
  Publisher,
  Subjects,
  OrderCancelledEvent,
} from '@mrshahabtickets/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
