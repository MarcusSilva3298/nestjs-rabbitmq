import { Inject, Injectable } from '@nestjs/common';
import * as amqp from 'amqplib';
import { MessagesService } from './messages.service';
import { QueueNamesEnum, RabbitKeysEnum } from '../../shared/enums';

@Injectable()
export class QueuesService {
  constructor(
    @Inject(RabbitKeysEnum.RABBIT_CHANNEL)
    private readonly channel: amqp.Channel,
    @Inject(RabbitKeysEnum.RABBIT_SERVICE)
    private readonly messagesService: MessagesService,
  ) {
    this.channel.consume(
      QueueNamesEnum.CONSUMER,
      (msg) => {
        this.consumerQueue(msg);
      },
      { noAck: true },
    );
  }

  consumerQueue(msg: amqp.ConsumeMessage) {
    console.log(msg.content.toString());
    this.messagesService.reply(
      'Mensagem recebida e processada',
      msg.properties.replyTo,
      msg.properties.correlationId,
    );
  }
}
