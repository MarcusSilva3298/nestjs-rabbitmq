import { DynamicModule, Logger, Module } from '@nestjs/common';
import { Subject, firstValueFrom, timeout } from 'rxjs';
import * as amqp from 'amqplib';
import { RabbitKeysEnum } from '../shared/enums';
import { MessagesService } from './rabbit/messages.service';
import { QueuesService } from './rabbit/queues.service';

@Module({})
export class MessengerModule {
  static readonly channelSubject = new Subject<amqp.Channel>();

  static async forRootAsync(): Promise<DynamicModule> {
    try {
      const connection = await amqp.connect('amqp://root:root@localhost:5672');

      const channel = await connection.createChannel();

      channel.assertExchange('testeAssertExchange', 'fanout', {
        durable: false,
      });

      const queue = await channel.assertQueue('consumers-queue', {
        arguments: { 'x-queue-type': 'quorum' },
      });

      await channel.bindQueue(queue.queue, 'testeAssertExchange', 'consumers');

      this.channelSubject.next(channel);
      this.channelSubject.complete();

      return {
        module: MessengerModule,
        providers: [
          {
            provide: RabbitKeysEnum.RABBIT_CHANNEL,
            useValue: channel,
          },
          {
            inject: [RabbitKeysEnum.RABBIT_CHANNEL],
            provide: RabbitKeysEnum.RABBIT_SERVICE,
            useFactory: (channel) => new MessagesService(channel),
          },
          {
            inject: [
              RabbitKeysEnum.RABBIT_CHANNEL,
              RabbitKeysEnum.RABBIT_SERVICE,
            ],
            provide: RabbitKeysEnum.QUEUE_SERVICE,
            useFactory: (channel, QueueService) =>
              new QueuesService(channel, QueueService),
          },
        ],
        exports: [RabbitKeysEnum.RABBIT_SERVICE, RabbitKeysEnum.RABBIT_CHANNEL],
      };
    } catch (error) {
      Logger.fatal(error, 'RabbitMQ Module');

      process.exit(1);
    }
  }

  static async forFeatureAsync(): Promise<DynamicModule> {
    try {
      const channel = await firstValueFrom(
        this.channelSubject.pipe(timeout(3000)),
      );

      return {
        module: MessengerModule,
        providers: [
          {
            provide: RabbitKeysEnum.RABBIT_CHANNEL,
            useValue: channel,
          },
          {
            inject: [RabbitKeysEnum.RABBIT_CHANNEL],
            provide: RabbitKeysEnum.RABBIT_SERVICE,
            useFactory: (channel) => new MessagesService(channel),
          },
        ],
        exports: [RabbitKeysEnum.RABBIT_SERVICE],
      };
    } catch (error) {
      Logger.fatal('Await rabbit channel timeout', 'RabbitMQ Module');

      process.exit(1);
    }
  }
}
