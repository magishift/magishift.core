import { PubSub } from 'graphql-subscriptions';

const pubSub = new PubSub();

export const PubSubProvider = {
  provide: 'PubSub',
  useValue: pubSub,
};

export class PubSubList {
  private static registeredPubSub: object = {};

  static RegisterPubsub(name: string, type: string): void {
    PubSubList.registeredPubSub[name] = type;
  }

  static get GetPubSubSchema(): string {
    const result = [];

    Object.keys(PubSubList.registeredPubSub).map(name => {
      result.push(`   ${name}: ${PubSubList.registeredPubSub[name]}`);
    });

    return `schema {\n  subscription: Subscription\n}\n\ntype Subscription {\n${result.join('\n')}}\n\n`;
  }
}
