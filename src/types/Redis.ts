import { RedisArgument } from 'redis';

export type RedisEventCreator = {
    key: string;
    id?: string;
    message: Record<string, RedisArgument>;
}
