import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MessengerModule } from './messenger/messenger.module';
import { ConfigModule } from '@nestjs/config';
import { validateEnvVariables } from './config/configModule/validate';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
      validate: validateEnvVariables,
    }),
    MessengerModule.forRootAsync(),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
