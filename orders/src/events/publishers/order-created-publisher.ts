import {
  Publisher,
  OrderCreatedEvent,
  Subjects,
} from '@mrshahabtickets/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
