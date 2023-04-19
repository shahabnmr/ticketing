import {
  Subjects,
  Publisher,
  expirationCompleteEvent,
} from '@mrshahabtickets/common';

export class ExpirationCompletePublisher extends Publisher<expirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
