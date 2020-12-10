import { Logger } from "./models";

export class SimpleLogger implements Logger {
  error(...args: any[]): void {
    console.error(...args);
  }
  log(...args: any[]): void {
    console.table(args);
  }
  warn(...args: any[]): void {
    console.warn(...args);
  }
}
