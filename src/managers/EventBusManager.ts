import { IManager } from "../interfaces/IManager";
import { IEventBus } from "../interfaces/IEventBus";
import { EventBus } from "../components/EventBus";
import { uuidGenerator } from "../utils/Helper";
import { ItemNotFoundException } from "../exceptions/ItemNotFoundException";
import { InvalidArgException } from "../exceptions/InvalidArgException";

export class EventBusManager implements IManager<EventBus<any>> {
    private eventBusMap: Map<string, EventBus<any>> = new Map<string, EventBus<any>>();
    private static self: EventBusManager|null = null;
    
    static singleton(): EventBusManager {
        if(this.self === null) {
            this.self = new EventBusManager();
        }

        return this.self;
    }

    add(eventBus: EventBus<any>): void {
        if(eventBus instanceof EventBus) {
            const uuid = eventBus.getId();

            if(uuid !== null && !this.eventBusMap.has(uuid)) {
                this.eventBusMap.set(uuid, eventBus.clone());
            } else {
                throw new InvalidArgException("Invalid eventbus provided");
            }
        } else {
            throw new InvalidArgException("argument must be of type EventBus");
        }
    }
    
    update(eventBus: EventBus<any>): void {
        if(eventBus instanceof EventBus) {
            const uuid = eventBus.getId();

            if(uuid !== null && this.eventBusMap.has(uuid)) {
                this.eventBusMap.set(uuid, eventBus.clone());
            } else {
                throw new ItemNotFoundException("argument doesn't exists");
            }
        } else {
            throw new InvalidArgException("argument must be of type EventBus");
        }
    }
    
    delete(uuid: string): EventBus<any> {
        const eventBus: EventBus<any>|undefined = this.eventBusMap.get(uuid);
        if(eventBus !== undefined) {
            this.eventBusMap.delete(uuid);
            return eventBus;
        } else {
            throw new ItemNotFoundException(`EventBus with id ${uuid} doesn't exists`);
        }
    }
    
    get(uuid: string): EventBus<any> {
        const eventBus: EventBus<any>|undefined = this.eventBusMap.get(uuid);
        if(eventBus !== undefined) {
            return eventBus;
        } else {
            throw new ItemNotFoundException(`EventBus with id ${uuid} doesn't exists`);
        }
    }

    public iterator(): IterableIterator<[string, EventBus<any>]> {
        return this.eventBusMap.entries();
    }
}