import { Inject, Injectable } from '@nestjs/common';
import { MessagesService } from '../messenger/rabbit/messages.service';
import { RabbitKeysEnum } from '../shared/enums';

@Injectable()
export class GenericService {
  constructor(
    @Inject(RabbitKeysEnum.RABBIT_SERVICE)
    private readonly messagesService: MessagesService,
  ) {}
}
