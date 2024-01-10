import { Module } from '@nestjs/common';
import { MessengerModule } from '../messenger/messenger.module';

@Module({
  imports: [MessengerModule.forFeatureAsync()],
})
export class GenericModule {}
