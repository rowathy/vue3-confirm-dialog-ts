type EventHandler = (data?: any) => void;

class Event {
    private events: { [eventName: string]: EventHandler[] } = {};

    on(eventName: string, fn: EventHandler): void {
        this.events[eventName] = this.events[eventName] || [];
        this.events[eventName].push(fn);
    }

    off(eventName: string, fn: EventHandler): void {
        if (this.events[eventName]) {
            this.events[eventName] = this.events[eventName].filter((eventFn) => eventFn !== fn);
        }
    }

    emit(eventName: string, data?: any): void {
        if (this.events[eventName]) {
            this.events[eventName].forEach((fn) => {
                fn(data);
            });
        }
    }
}

export default new Event();
