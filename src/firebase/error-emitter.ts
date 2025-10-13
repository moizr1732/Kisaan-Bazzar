
// A simple, generic event emitter.
type Listener<T> = (data: T) => void;

class EventEmitter<TEventMap extends Record<string, any>> {
  private listeners: { [K in keyof TEventMap]?: Listener<TEventMap[K]>[] } = {};

  on<K extends keyof TEventMap>(event: K, listener: Listener<TEventMap[K]>): void {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event]!.push(listener);
  }

  off<K extends keyof TEventMap>(event: K, listener: Listener<TEventMap[K]>): void {
    if (!this.listeners[event]) {
      return;
    }
    this.listeners[event] = this.listeners[event]!.filter(l => l !== listener);
  }

  emit<K extends keyof TEventMap>(event: K, data: TEventMap[K]): void {
    if (!this.listeners[event]) {
      return;
    }
    this.listeners[event]!.forEach(listener => listener(data));
  }
}

// Define the events and their payload types
interface ErrorEvents {
  'permission-error': Error;
}

// Create and export a singleton instance
export const errorEmitter = new EventEmitter<ErrorEvents>();
