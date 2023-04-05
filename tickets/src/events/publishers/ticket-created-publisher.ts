import {
  Publisher,
  Subjects,
  TicketCreatedEvent,
} from '@mrshahabtickets/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
}
