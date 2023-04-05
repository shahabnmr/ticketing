import { Message, Stan } from 'node-nats-streaming';
import { Subjects } from './subjects';
//*
interface Event {
  subject: Subjects;
  data: any;
}

//*
export abstract class Listener<T extends Event> {
  // darim migim T (type ei ke)toseye peida karde az Event
  abstract subject: T['subject'];
  abstract queueGroupName: string;
  abstract onMessage(data: T['data'], msg: Message): void;
  private client: Stan;
  protected ackWait = 5 * 1000; //5 seconds

  constructor(client: Stan) {
    this.client = client;
  }

  subscriptionOptions() {
    return this.client
      .subscriptionOptions()
      .setDeliverAllAvailable() // tamom event hai ke ersal shode ro dar log neshon mide
      .setManualAckMode(true)
      .setAckWait(this.ackWait) // zamane daryafte event listener ye ack mifreste be publisher ke are event daryaft shod va gar ack ersal nashe ta hododan 30 sanie dobare ersal mikone event ro
      .setDurableName(this.queueGroupName); //age ye moghe listener down shod ba komak in event ha dar nats zakhire mimone ta listener up beshe va dar edame event haro run kone yani reshte pardazesh pare nashe
    // baraye stefade durableName hatman va bayad queue group dashte bashim va gar durable be hich vaj kar nemikone va az aval event ha run mishe
  }

  listen() {
    const subscription = this.client.subscribe(
      this.subject,
      this.queueGroupName, //ye saf tashkil midim baraye listener masalan vaghti khastim chandta listener dashte bashim bayad safe tashkil bedim ke duplicate nadashte bashim
      // baraye stefade durableName hatman va bayad queue group dashte bashim va gar durable be hich vaj kar nemikone va az aval event ha run mishe
      this.subscriptionOptions()
    );

    subscription.on('message', (msg: Message) => {
      console.log(`Message received: ${this.subject} / ${this.queueGroupName}`);

      const parsedData = this.parseMessage(msg);

      this.onMessage(parsedData, msg);
    });
  }

  parseMessage(msg: Message) {
    const data = msg.getData();
    return typeof data === 'string'
      ? JSON.parse(data)
      : JSON.parse(data.toString('utf-8'));
  }
}
