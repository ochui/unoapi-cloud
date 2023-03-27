import { Outgoing } from './outgoing'
import { getStore } from './store'
import { Response } from './response'
import { Incoming } from './incoming'
import { Status } from './socket'

export interface getClient {
  (phone: string, incoming: Incoming, outgoing: Outgoing, getStore: getStore, config: ClientConfig): Promise<Client>
}

export class ConnectionInProgress extends Error {
  constructor(message: string) {
    super(message)
  }
}

export type ClientConfig = {
  ignoreGroupMessages: boolean
  ignoreBroadcastMessages: boolean
  ignoreBroadcastStatuses: boolean
  ignoreHistoryMessages: boolean
  ignoreOwnMessages: boolean
  sendConnectionStatus: boolean
  autoRestart: boolean
  rejectCalls: string
  rejectCallsWebhook: string
}

export const defaultClientConfig: ClientConfig = {
  ignoreGroupMessages: true,
  ignoreBroadcastStatuses: true,
  ignoreBroadcastMessages: false,
  ignoreHistoryMessages: true,
  ignoreOwnMessages: true,
  sendConnectionStatus: true,
  rejectCalls: '',
  rejectCallsWebhook: '',
  autoRestart: false,
}

export interface Client {
  phone: string
  config: ClientConfig

  connect(): Promise<void>

  disconnect(): Promise<void>

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  send(payload: any): Promise<Response>

  getStatus(): Status
}
