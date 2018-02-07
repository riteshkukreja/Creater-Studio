import * as $ from 'jquery';
import { Filter } from './Filter';
import { IEventBus } from '../interfaces/IEventBus';
import { IEventMessageItem } from '../interfaces/EventMessageItem';
import { IClonableItem } from '../interfaces/IClonableItem';
import { IBusType } from '../interfaces/IBusType';

export class EventBus<T> implements IEventBus<T>, IEventMessageItem, IClonableItem<EventBus<any>> {
    private dom: JQuery<HTMLDivElement>;
    private _uuid: string|null = null;
    private debug: boolean = false;

    constructor(uuid: IBusType, debug?: boolean) {
        this.dom = <JQuery<HTMLDivElement>> $("<div/>");
        this._uuid = uuid.toString();

        if(debug !== undefined)
            this.debug = debug;
    }

    /**
     * Subscribe to an event queue in the eventbus
     * 
     * @param event: type of event to subscribe listener
     * @param callback: event listener to execute on subscribed event
     */
    subscribe(event: string, callback: (event: JQuery.Event, data: T) => void): void {
        if(this.debug)
            console.log(`[${this._uuid}] Received subscribe on ${event} event`);
        this.dom.on(event, callback);
    }

    /**
     * Unsubscribe to an event queue in the eventbus
     * 
     * @param event: type of event to unsubscribe listener
     * @param callback: event listener to unsubscribed from the queue
     */
    unsubscribe(event: string, callback: (event: JQuery.Event) => void): void {
        if(this.debug)
            console.log(`[${this._uuid}] Received unsubscribe on ${event} event`);
        this.dom.off(event, callback);
    }

    /**
     * Publish a event with data
     * 
     * @param event: type of event to publish
     * @param data: payload to send with the event
     */
    publish(event: string, data: T): void {
        if(this.debug)
            console.log(`[${this._uuid}] Received publish on ${event} event with data`, data);
        this.dom.trigger(event, data);
    }

    getId(): string | null {
        return this._uuid;
    }

    setId(uuid: string): void {
        this._uuid = uuid;
    }

    /**
     * EventBus is not clonable. Returns itself for singleton design.
     */
    clone(): EventBus<any> {
        return this;
    }
}

export const StudioEventBus: EventBus<any> = new EventBus(IBusType.GLOBAL, false);
export const FilterEventBus: EventBus<Filter> = new EventBus(IBusType.FILTER);
export const LayerEventBus: EventBus<Filter> = new EventBus(IBusType.LAYER);
export const ToolEventBus: EventBus<Filter> = new EventBus(IBusType.TOOL, true);