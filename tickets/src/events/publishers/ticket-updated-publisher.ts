import {
  Publisher,
  Subjects,
  TicketUpdatedEvent,
} from '@mrshahabtickets/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}
