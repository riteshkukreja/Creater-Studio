import { StudioEventBus } from '../components/EventBus';
import { Filter } from '../components/Filter';
import * as $ from 'jquery';
import { IManager } from '../interfaces/IManager';
import { uuidGenerator } from '../utils/Helper';

export class FilterManager implements IManager<Filter> {
    private filters: Map<string, Filter> = new Map<string, Filter>();

    constructor() {
        StudioEventBus.subscribe('add-filter', (event: JQuery.Event, layer: any) => {
            let filter = new Filter(layer.name);
            filter.updateContent(layer.getImageSrc());

            this.add(filter);
        });
    }

    add(filter: Filter): void {
        if(filter instanceof Filter) {
            const uuid = uuidGenerator();

            this.filters.set(uuid, filter);
            filter.setId(uuid);
            
            StudioEventBus.publish("filter-add", { id: filter.getId(), name: filter.getName() });
        } else {
            throw "Not a filters object";
        }
    }

    update(id: number): void {
        if(id in this.filters) {
            this.filters[id].update();
        } else {
            throw "Not a valid filter";
        }
    }

    get(id: number): Filter {
        if(id in this.filters) {
            return this.filters[id];
        } else {
            throw "Not a valid filter";
        }
    }
    
    rename(id: number, name: string): void {
        if(id in this.filters) {
            this.filters[id].rename(name);
            
            StudioEventBus.publish("filter-rename", { id: id, name: name });
        } else {
            throw "Not a valid filter";
        }
    }

    delete(id: number): void {
        if(id in this.filters) {
            delete this.filters[id];
            
            StudioEventBus.publish("filter-deleted", { id: id });
        } else {
            throw "Not a valid filter";
        }
    }

    apply(id: number, context: CanvasRenderingContext2D): void {
        if(id in this.filters) {
            this.filters[id].apply(context);
        } else {
            throw "Not a valid filter";
        }
    }
}

export const FilterManagerModule: FilterManager = new FilterManager();