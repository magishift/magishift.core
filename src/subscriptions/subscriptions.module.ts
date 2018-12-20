import { DynamicModule, Inject, Module, OnModuleDestroy } from '@nestjs/common';
import { execute, GraphQLSchema, subscribe } from 'graphql';
import * as http from 'http';
import * as https from 'https';
import { ServerOptions, SubscriptionServer } from 'subscriptions-transport-ws';
import * as WebSocket from 'ws';
import { SUBSCRIPTION_SERVER } from './subscription.constants';
import { createSubscriptionProviders } from './subscription.providers';

@Module({
  exports: [SubscriptionsModule],
})
export class SubscriptionsModule implements OnModuleDestroy {
  private subscriptionServer: SubscriptionServer;

  constructor(
    @Inject(SUBSCRIPTION_SERVER)
    private readonly ws: http.Server | https.Server,
  ) {}

  static forRoot(port: number = 3001): DynamicModule {
    const providers = createSubscriptionProviders(port);
    return {
      module: SubscriptionsModule,
      providers: [...providers],
      exports: [...providers],
    };
  }

  createSubscriptionServer(
    schema: GraphQLSchema,
    options: ServerOptions = {},
    socketOptions: WebSocket.ServerOptions = {},
  ): SubscriptionServer {
    this.subscriptionServer = new SubscriptionServer(
      {
        execute,
        subscribe,
        schema,
        ...options,
      },
      {
        server: this.ws,
        path: '/subscriptions',
        ...socketOptions,
      },
    );

    return this.subscriptionServer;
  }

  onModuleDestroy(): void {
    this.ws.close();
  }
}
