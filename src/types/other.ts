import * as mediasoupClient from 'mediasoup-client'
import { Transport } from 'mediasoup-client/lib/types'

export interface IConsumingTransport {
    consumerTransport: Transport
    serverConsumerTransportId: string
    producerId: string
    consumer: mediasoupClient.types.Consumer,
    socketId: string
}