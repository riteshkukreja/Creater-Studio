import { Filter } from '../components/Filter';
import { IManager } from '../interfaces/IManager';
import { uuidGenerator } from '../utils/Helper';
import { InvalidArgException } from '../exceptions/InvalidArgException';
import { ItemNotFoundException } from '../exceptions/ItemNotFoundException';
import { IManagerItem } from '../interfaces/IManagerItem';
import { EventBusManager } from './EventBusManager';
import { IBusType } from '../interfaces/IBusType';
import { EventBus, StudioEventBus } from '../components/EventBus';

export class Manager<T extends IManagerItem<T>> implements IManager<T> {
    private itemMap: Map<string, T> = new Map<string, T>();
    private _queue: IBusType|null = null;
    private eventBus: EventBus<T>|null = null;

    bootstrap(queue: IBusType) {
        this._queue = queue;

        this.eventBus = StudioEventBus;//EventBusManager.singleton().get(this._queue.toString());
    }

    public add(item: T): void {
        try {
            const uuid = uuidGenerator();

            item.setId(uuid);
            this.itemMap.set(uuid, item.clone());

            /** Notify event queue */
            if(this.eventBus !== null && this._queue !== null) {
                this.eventBus.publish(this._queue.toString() + ManagerEvents.ADD.toString(), item.clone());
            }

        } catch(e) {
            throw new InvalidArgException("argument must be of type item");
        }
    }
    
    public update(item: T): void {
        try {
            const uuid = item.getId();

            if(uuid !== null && this.itemMap.has(uuid)) {
                this.itemMap.set(uuid, item.clone());

                /** Notify event queue */
                if(this.eventBus !== null && this._queue !== null) {
                    this.eventBus.publish(this._queue.toString() + ManagerEvents.UPDATE.toString(), item.clone());
                }
            } else {
                throw new ItemNotFoundException("argument doesn't exists");
            }
        } catch(e) {
            throw new InvalidArgException("argument must be of type item");
        }
    }
    
    public delete(uuid: string): T {
        const item: T|undefined = this.itemMap.get(uuid);
        if(item !== undefined) {
            this.itemMap.delete(uuid);
            
            /** Notify event queue */
            if(this.eventBus !== null && this._queue !== null) {
                this.eventBus.publish(this._queue.toString() + ManagerEvents.REMOVE.toString(), item.clone());
            }

            return item;
        } else {
            throw new ItemNotFoundException(`item with id ${uuid} doesn't exists`);
        }
    }
    
    public get(uuid: string): T {
        const item: T|undefined = this.itemMap.get(uuid);
        if(item !== undefined) {
            return item;
        } else {
            throw new ItemNotFoundException(`item with id ${uuid} doesn't exists`);
        }
    }

    public iterator(): IterableIterator<[string, T]> {
        return this.itemMap.entries();
    }
}

export enum ManagerEvents {
    ADD = 'add',
    UPDATE = 'update',
    REMOVE = 'delete'
}