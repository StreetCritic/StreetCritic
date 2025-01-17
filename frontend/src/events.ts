export class Event {
  readonly type: string;
  constructor(type: string) {
    this.type = type;
  }
}

export function dispatchEvent(_event: Event) {}
