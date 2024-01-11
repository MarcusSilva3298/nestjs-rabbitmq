import { Expose } from 'class-transformer';
import * as Joi from 'joi';

export class EnvVariables {
  @Expose()
  MESSENGER_BROKER_URL: string;
}

export enum EnvVariablesEnum {
  MESSENGER_BROKER_URL = 'MESSENGER_BROKER_URL',
}

export const envSchema = Joi.object<EnvVariables>({
  MESSENGER_BROKER_URL: Joi.string().required().messages({
    'string.base': 'MESSENGER_BROKER_URL deve ser uma string',
    'any.required': 'Insira uma variável MESSENGER_BROKER_URL',
  }),
});
