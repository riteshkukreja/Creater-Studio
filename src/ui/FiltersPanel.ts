import { Filter } from "../components/Filter";
import { Panel, LayerFilterPanel } from "./components/Panel";
import { StudioEventBus } from "../components/EventBus";
import { FilterManagerModule } from "../managers/FilterManager";

import * as $ from 'jquery';
import "jquery-ui-bundle";

export class FiltersPanel {
    private panel: Panel;
    private filtersDom: Map<number, JQuery<HTMLDivElement>> = new Map<number, JQuery<HTMLDivElement>>();
    private filterHolder: JQuery<HTMLElement>;
    private selectedFilter: JQuery<HTMLElement>;

    private addTopControls(): void {
        const controlHolder = $("<div/>", { class: 'controls' });

        const applyControl = $("<i/>", { class: 'applyIcon' });
        applyControl.click(e => {
            // TODO apply selected filter to main canvas
            if(this.selectedFilter) {
                const fil = FilterManagerModule.get(this.selectedFilter.data('id'));
                StudioEventBus.publish("filter-apply", fil);
            }
        });

        let deleteControl = $("<i/>", { class: 'deleteIcon' });
        deleteControl.click(e => {
            // TODO delete filter
            if(this.selectedFilter)
                FilterManagerModule.delete(this.selectedFilter.data('id'));
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
        const id: number = parent.data('id');
        const name: string = parent.children().first().text();

        const nameInput = $("<input/>", { type: 'text', value: name, class: 'layer-input' });
        nameInput.on('blur', e => {
            // TODO rename filter from manager
            FilterManagerModule.rename(id, <string> nameInput.val() || "");

            nameInput.remove();
            parent.children().first().removeClass("hidden");
        });

        nameInput.on('keyup', e => {
            const code: number = e.keyCode || e.charCode || e.which;

            if(code === 13) {
                // TODO rename filter from manager
                FilterManagerModule.rename(id, <string> nameInput.val() || "");
                
                nameInput.remove();
                parent.children().first().removeClass("hidden");
            }
        });
        
        parent.append(nameInput);
        parent.children().first().addClass("hidden");

        nameInput.focus();
    }

    private addFiltersAtEnd(id: number, name: string): void {
        const filter: JQuery<HTMLDivElement> = <JQuery<HTMLDivElement>> $("<div/>", { 'data-id': id, class: 'layer' });
        const filterTitle: JQuery<HTMLSpanElement> = <JQuery<HTMLSpanElement>> $("<span/>", { html: name });

        filter.click(e => {
            StudioEventBus.publish("filter-selected", { id: id });
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
        
        StudioEventBus.publish("filter-selected", { id: id });
    }

    private renameFilter(id: number, name: string): void {
        if(this.filtersDom.has(id)) {
            const selectedFilter = this.filtersDom.get(id);

            if(selectedFilter !== undefined)
                selectedFilter.children().first().text(name);
        } else {
            throw "Filter doesn't exists";
        }
    }
    
    private selectFilter(id: number): void {
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
    
    private deleteFilter(id: number): void {
        if(this.filtersDom.has(id)) {
            const filter = this.filtersDom.get(id);
            if(filter) {
                filter.remove();
                this.filtersDom.delete(id);
            }
        } else {
            throw "Filter doesn't exists";
        }
    }

    initialize(panel: Panel): void {
        this.panel = panel;
        this.filterHolder = this.panel.addSubPanel("Filters");

        StudioEventBus.subscribe("filter-add", (event: JQuery.Event, data: any) => {
            this.addFiltersAtEnd(data.id, data.name);
        });

        StudioEventBus.subscribe("filter-rename", (event: JQuery.Event, data: any) => {
            this.renameFilter(data.id, data.name);
        });

        StudioEventBus.subscribe("filter-selected", (event: JQuery.Event, data: any) => {
            this.selectFilter(data.id);
        });
        
        StudioEventBus.subscribe("filter-deleted", (event: JQuery.Event, data: any) => {
            this.deleteFilter(data.id);
        });

        this.addTopControls();
    }
    
}

export const FiltersPanelModule: FiltersPanel = new FiltersPanel();