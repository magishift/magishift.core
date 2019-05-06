import { PubSub } from 'graphql-subscriptions';
import _ = require('lodash');

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

    _.forEach(PubSubList.registeredPubSub, (val, name) => {
      result.push(`   ${name}: ${val}`);
    });

    return `schema {\n  subscription: Subscription\n}\n\ntype Subscription {\n${result.join('\n')}}\n\n`;
  }
}
