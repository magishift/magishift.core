import { Console } from 'console';

const log = new Console(process.stderr, process.stderr);

export function logTest(...content: (string | object)[]): void {
  log.info(...content);
}
