import mongoose from 'mongoose';

interface EmailAttrs {
  orderId: string;
  donePayment: boolean;
  reminderTicket?: boolean;
}

interface EmailDoc extends mongoose.Document {
  orderId: string;
  donePayment: boolean;
  remiderTicket: boolean;
}

interface EmailModel extends mongoose.Model<EmailDoc> {
  build(attrs: EmailAttrs): EmailDoc;
}

const emailSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
    },
    donePayment: {
      type: Boolean,
      required: true,
      default: false,
    },
    reminderTicket: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

emailSchema.statics.build = (attrs: EmailAttrs) => {
  return new Email(attrs);
};

const Email = mongoose.model<EmailDoc, EmailModel>('Email', emailSchema);

export { Email };
