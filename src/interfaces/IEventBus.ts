export interface IEventBus<T> {

    /**
     * Subscribe to an event queue in the eventbus
     * 
     * @param event: type of event to subscribe listener
     * @param callback: event listener to execute on subscribed event
     */
    subscribe(event: string, callback: (event: JQuery.Event, data: T) => void): void;

    /**
     * Unsubscribe to an event queue in the eventbus
     * 
     * @param event: type of event to unsubscribe listener
     * @param callback: event listener to unsubscribed from the queue
     */
    unsubscribe(event: string, callback: (event: JQuery.Event) => void): void;

    /**
     * Publish a event with data
     * 
     * @param event: type of event to publish
     * @param data: payload to send with the event
     */
    publish(event: string, data: T): void;
}