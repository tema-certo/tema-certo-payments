import amqp from 'amqplib';
import { streamsConfig } from '~/config/streams.config';

type ChannelMQ = {
    queueSetter: string;
    settings?: amqp.Options.AssertQueue;
}

export async function getChannelMQ({
    queueSetter,
    settings,
}: ChannelMQ): Promise<amqp.Channel> {
    const connect = await amqp.connect(streamsConfig.amqpBaseUrl);
    const connected = await connect.createChannel();

    await connected.assertQueue(queueSetter, settings);

    return connected;
}
