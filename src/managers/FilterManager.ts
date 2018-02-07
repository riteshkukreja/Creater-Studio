import { FilterEventBus, StudioEventBus } from '../components/EventBus';
import { Filter } from '../components/Filter';
import * as $ from 'jquery';
import { IManager } from '../interfaces/IManager';
import { uuidGenerator } from '../utils/Helper';
import { Manager } from './Manager';
import { IBusType } from '../interfaces/IBusType';
import { EventBusManager } from './EventBusManager';
import { Layer } from '../components/Layer';
import { FilterPanelEvents } from '../ui/panels/FiltersPanel';

export class FilterManager extends Manager<Filter> {
    private static self: FilterManager|null = null;
    private selectedFilter: Filter|null = null;

    bootstrap() {
        super.bootstrap(IBusType.FILTER);
    }

    public static singleton(): FilterManager {
        if(this.self === null) {
            this.self = new FilterManager();
            this.self.bootstrap();
        }

        return this.self;
    }

    public setSelected(id: string) {
        try {
            this.selectedFilter = this.get(id);
            StudioEventBus.publish(FilterManagerEvents.FILTER_SELECTED.toString(), this.selectedFilter.clone());
        } catch(e) {
            throw e;
        }
    }
}

export enum FilterManagerEvents {
    FILTER_SELECTED = "filtermanager:filter-selected"
}