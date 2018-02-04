import { Filter } from "../../components/Filter";
import { Panel, LayerFilteWindow } from "../components/Panel";
import { StudioEventBus } from "../../components/EventBus";

import * as $ from 'jquery';
import "jquery-ui-bundle";
import { FilterManager, FilterManagerEvents } from "../../managers/FilterManager";
import { IUISubPanel } from "../../exceptions/IUISubPanel";
import { IBusType } from "../../interfaces/IBusType";
import { ManagerEvents } from "../../managers/Manager";
import { InvalidArgException } from "../../exceptions/InvalidArgException";

export class FiltersPanel implements IUISubPanel {
    private panel: Panel;
    private filtersDom: Map<string, JQuery<HTMLDivElement>> = new Map<string, JQuery<HTMLDivElement>>();
    private filterHolder: JQuery<HTMLElement>;
    private selectedFilter: JQuery<HTMLElement>;

    private addTopControls(): void {
        const controlHolder = $("<div/>", { class: 'controls' });

        const applyControl = $("<i/>", { class: 'applyIcon' });
        applyControl.click(e => {
            // TODO apply selected filter to main canvas
            if(this.selectedFilter) {
                const id: string = this.selectedFilter.data('id');
                const fil = FilterManager.singleton().get(id);
                StudioEventBus.publish(FilterPanelEvents.FILTER_APPLY, fil);
            }
        });

        let deleteControl = $("<i/>", { class: 'deleteIcon' });
        deleteControl.click(e => {
            // TODO delete filter
            if(this.selectedFilter) {
                const id: string = this.selectedFilter.data('id');
                FilterManager.singleton().delete(id);
            }
        });
        
        controlHolder.append(applyControl);
        controlHolder.append(deleteControl);

        this.filterHolder.append(controlHolder);
    }
    
    private addFilterControls(): JQuery<HTMLElement> {
        const controlHolder = $("<div/>", { class: 'controls' });
        
        const renameFilterControl = $("<i/>", { class: 'renameIcon' });
        renameFilterControl.click(e => {
            this.onRenameHandler($(e.target).parent().parent());
        });

        controlHolder.append(renameFilterControl);

        return controlHolder;
    }

    private onRenameHandler(parent: JQuery<HTMLElement>): void {
        const id: string = parent.data('id');
        const name: string = parent.children().first().text();

        const filter: Filter = FilterManager.singleton().get(id.toString());

        const nameInput = $("<input/>", { type: 'text', value: name, class: 'layer-input' });
        nameInput.on('blur', e => {
            // TODO rename filter from manager
            filter.rename(<string> nameInput.val() || "");
            FilterManager.singleton().update(filter);

            nameInput.remove();
            parent.children().first().removeClass("hidden");
        });

        nameInput.on('keyup', e => {
            const code: number = e.keyCode || e.charCode || e.which;

            if(code === 13) {
                // TODO rename filter from manager
                filter.rename(<string> nameInput.val() || "");
                FilterManager.singleton().update(filter);
                
                nameInput.remove();
                parent.children().first().removeClass("hidden");
            }
        });
        
        parent.append(nameInput);
        parent.children().first().addClass("hidden");

        nameInput.focus();
    }

    private addFiltersAtEnd(id: string, name: string): void {
        const filter: JQuery<HTMLDivElement> = <JQuery<HTMLDivElement>> $("<div/>", { 'data-id': id, class: 'layer' });
        const filterTitle: JQuery<HTMLSpanElement> = <JQuery<HTMLSpanElement>> $("<span/>", { html: name });

        filter.click(e => {
            FilterManager.singleton().setSelected(id);
        });

        filter.dblclick(e => {
            this.onRenameHandler($(e.target));
        });

        filterTitle.dblclick(e => {
            this.onRenameHandler($(e.target).parent());
        });

        filter.append(filterTitle);
        filter.append(this.addFilterControls());

        this.filterHolder.append(filter);
        this.filtersDom.set(id,  filter);
        
        FilterManager.singleton().setSelected(id);
    }

    private renameFilter(id: string, name: string): void {
        if(this.filtersDom.has(id)) {
            const selectedFilter = this.filtersDom.get(id);

            if(selectedFilter !== undefined)
                selectedFilter.children().first().text(name);
        } else {
            throw "Filter doesn't exists";
        }
    }
    
    private selectFilter(id: string): void {
        if(this.filtersDom.has(id)) {
            const nextFilter = this.filtersDom.get(id);
            if(nextFilter !== undefined) {
                if(this.selectedFilter)
                    this.selectedFilter.removeClass("layer-selected");

                this.selectedFilter = nextFilter;
                this.selectedFilter.addClass("layer-selected");
            }
        } else {
            throw "Filter doesn't exists";
        }
    }
    
    private deleteFilter(id: string): void {
        if(this.filtersDom.has(id)) {
            const filter = this.filtersDom.get(id);
            if(filter !== undefined) {
                filter.remove();
                this.filtersDom.delete(id);
            }
        } else {
            throw "Filter doesn't exists";
        }
    }

    public initialize(panel: Panel): void {
        this.panel = panel;
        this.filterHolder = this.panel.addSubPanel("Filters");

        StudioEventBus.subscribe(IBusType.FILTER.toString() + ManagerEvents.ADD.toString(), (event: JQuery.Event, data: Filter) => {
            const _id = data.getId();
            if(_id !== null)
                this.addFiltersAtEnd(_id, data.getName());
            else
                throw new InvalidArgException("added filter has id of null");
        });

        StudioEventBus.subscribe(IBusType.FILTER.toString() + ManagerEvents.UPDATE.toString(), (event: JQuery.Event, data: Filter) => {
            const _id = data.getId();
            if(_id !== null)
                this.renameFilter(_id, data.getName());
            else
                throw new InvalidArgException("updated filter has id of null");
        });
        
        StudioEventBus.subscribe(IBusType.FILTER.toString() + ManagerEvents.REMOVE.toString(), (event: JQuery.Event, data: Filter) => {
            const _id = data.getId();
            if(_id !== null)
                this.deleteFilter(_id);
            else
                throw new InvalidArgException("deleted filter has id of null");
        });

        this.addTopControls();

        /** my events */
        StudioEventBus.subscribe(FilterManagerEvents.FILTER_SELECTED.toString(), (event: JQuery.Event, data: Filter) => {
            const _id = data.getId();
            if(_id !== null)
                this.selectFilter(_id);
            else
                throw new InvalidArgException("selected filter has id of null");
        });
    }
    
}

export enum FilterPanelEvents {
    FILTER_APPLY = "filterpanel:filter-apply"
}

export const FiltersPanelModule: FiltersPanel = new FiltersPanel();