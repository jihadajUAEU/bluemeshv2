import { DaprClient, DaprServer, CommunicationProtocolEnum, HttpMethod } from '@dapr/dapr';

export class DaprService {
  private static instance: DaprService;
  private client: DaprClient;
  private server: DaprServer;
  private readonly stateStoreName = 'statestore';
  private readonly pubsubName = 'pubsub';

  private constructor() {
    this.client = new DaprClient({
      daprHost: process.env.DAPR_HOST || 'localhost',
      daprPort: process.env.DAPR_HTTP_PORT || '3500',
      communicationProtocol: CommunicationProtocolEnum.HTTP
    });

    this.server = new DaprServer({
      serverHost: process.env.SERVER_HOST || 'localhost',
      serverPort: process.env.SERVER_PORT || '3001',
      clientOptions: {
        daprHost: process.env.DAPR_HOST || 'localhost',
        daprPort: process.env.DAPR_HTTP_PORT || '3500'
      }
    });
  }

  public static getInstance(): DaprService {
    if (!DaprService.instance) {
      DaprService.instance = new DaprService();
    }
    return DaprService.instance;
  }

  // State Management
  async saveState<T>(key: string, value: T): Promise<void> {
    await this.client.state.save(this.stateStoreName, [
      {
        key,
        value
      }
    ]);
  }

  async getState<T>(key: string): Promise<T | undefined> {
    const result = await this.client.state.get(this.stateStoreName, key);
    return result ? JSON.parse(result as string) as T : undefined;
  }

  async deleteState(key: string): Promise<void> {
    await this.client.state.delete(this.stateStoreName, key);
  }

  // Pub/Sub
  async publishEvent(topic: string, payload: Record<string, unknown>): Promise<void> {
    await this.client.pubsub.publish(this.pubsubName, topic, payload);
  }

  subscribeToTopic(topic: string, callback: (data: Record<string, unknown>) => Promise<void>): void {
    this.server.pubsub.subscribe(this.pubsubName, topic, callback);
  }

  // Service Invocation
  async invokeMethod<T>(appId: string, methodName: string, payload?: Record<string, unknown>): Promise<T> {
    const result = await this.client.invoker.invoke(appId, methodName, HttpMethod.POST, payload);
    return result as T;
  }

  // Server Start
  async start(): Promise<void> {
    await this.server.start();
  }

  // Server Stop
  async stop(): Promise<void> {
    await this.server.stop();
  }
}

export const daprService = DaprService.getInstance();
