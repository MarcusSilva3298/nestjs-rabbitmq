import { plainToClass } from 'class-transformer';
import { EnvVariables, envSchema } from './schema';
import { Logger } from '@nestjs/common';

export function validateEnvVariables(options: Record<string, any>) {
  const parsedOptions = plainToClass(EnvVariables, options, {
    enableImplicitConversion: true,
    excludeExtraneousValues: true,
  });

  const result = envSchema.validate(parsedOptions, {
    abortEarly: false,
    allowUnknown: false,
  });

  if (result.error) {
    result.error.details.forEach(({ message }) => {
      Logger.error(message, 'ENV VARIABLES ERROR');
    });
    Logger.fatal('Fechando servidor');
    process.exit(1);
  }

  return parsedOptions;
}
