import { Inject, Injectable } from '@nestjs/common';
import * as amqp from 'amqplib';
import { randomUUID } from 'crypto';
import { RabbitKeysEnum } from '../../shared/enums';

@Injectable()
export class MessagesService {
  constructor(
    @Inject(RabbitKeysEnum.RABBIT_CHANNEL)
    private readonly channel: amqp.Channel,
  ) {}

  publish(content: string, routingKey: string): void {
    this.channel.publish(
      'testeAssertExchange',
      routingKey,
      Buffer.from(content),
      {
        correlationId: randomUUID(),
        replyTo: 'response-queue-name',
      },
    );
  }

  reply(contet: string, replyTo: string, correlationId: string): void {
    this.channel.sendToQueue(replyTo, Buffer.from(contet), {
      correlationId: correlationId,
    });
  }
}
