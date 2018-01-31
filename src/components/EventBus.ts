import * as $ from 'jquery';

export class EventBus {
    private dom: JQuery<HTMLDivElement>;

    constructor() {
        this.dom = <JQuery<HTMLDivElement>> $("<div/>");
    }

    subscribe(event: string, callback: (event: JQuery.Event, data: any) => void): void {
        this.dom.on(event, callback);
    }

    unsubscribe(event: string, callback: (event: JQuery.Event) => void): void {
        this.dom.off(event, callback);
    }

    publish(event: string, data: any): void {
        this.dom.trigger(event, data);
    }
}

export const StudioEventBus: EventBus = new EventBus();