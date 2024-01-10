import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MessengerModule } from './messenger/messenger.module';

@Module({
  imports: [MessengerModule.forRootAsync()],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
