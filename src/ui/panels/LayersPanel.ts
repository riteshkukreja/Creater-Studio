import { Panel, LayerFilteWindow } from "../components/Panel";
import { StudioEventBus, EventBus } from "../../components/EventBus";
import { LayerManager, LayerManagerEvents } from "../../managers/LayerManager";
import { Layer } from "../../components/Layer";
import * as $ from 'jquery';
import "jquery-ui-bundle";
import { IUISubPanel } from "../../exceptions/IUISubPanel";
import { EventBusManager } from "../../managers/EventBusManager";
import { IBusType } from "../../interfaces/IBusType";
import { FilterManagerEvents, FilterManager } from "../../managers/FilterManager";
import { ManagerEvents } from "../../managers/Manager";
import { Filter } from "../../components/Filter";

export class LayersPanel implements IUISubPanel {
    private panel: Panel;
    private layersDom: Map<string, JQuery<HTMLElement>> = new Map<string, JQuery<HTMLElement>>();

    private layerDomHolder: JQuery<HTMLElement>;
    private layerHolder: JQuery<HTMLElement>;
    private selectedLayer: JQuery<HTMLElement>;

    private addLayersHolder(): void {
        this.layerHolder = $("<div/>");
        this.layerDomHolder.append(this.layerHolder);
    }

    private addTopControls(): void {
        const controlHolder: JQuery<HTMLDivElement> = <JQuery<HTMLDivElement>> $("<div/>", { class: 'controls' });
        
        const addLayerControl: JQuery<HTMLElement> = $("<i/>", { class: 'addIcon' });
        addLayerControl.click(e => {
            LayerManager.singleton().add(new Layer("Untitled Layer"));
        });

        const addFilterControl: JQuery<HTMLElement> = $("<i/>", { class: 'recordIcon' });
        addFilterControl.click(e => {
            // TODO create filter
            const layer = LayerManager.singleton().getSelected();
            if(layer !== null) {
                const filter = new Filter(layer.getName());
                filter.updateContent(layer.getImageSrc());
                FilterManager.singleton().add(filter);
            }
        });

        const deleteControl: JQuery<HTMLElement> = $("<i/>", { class: 'deleteIcon' });
        deleteControl.click(e => {
            // TODO delete layer
            const layer = LayerManager.singleton().getSelected();
            if(layer !== null) {
                const id = layer.getId();
                if(id !==  null)
                    LayerManager.singleton().delete(id);
            }
        });
        
        controlHolder.append(addLayerControl);
        controlHolder.append(addFilterControl);
        controlHolder.append(deleteControl);

        this.layerDomHolder.append(controlHolder);
        this.layerDomHolder.append(this.addLayerAlphaControl());
    }
    
    private addLayerControls(): JQuery<HTMLElement> {
        const controlHolder: JQuery<HTMLDivElement> = <JQuery<HTMLDivElement>> $("<div/>", { class: 'controls' });
        
        const renameLayerControl: JQuery<HTMLElement> = $("<i/>", { class: 'renameIcon' });
        renameLayerControl.click(e => {
            this.onRenameHandler($(e.target).parent().parent());
        });

        const visibilityControl: JQuery<HTMLElement> = $("<i/>", { class: 'visibilityIcon', 'data-visible': true });
        visibilityControl.click(e => {
            const id: string = $(e.target).parent().parent().data('id');
            const visible: boolean = visibilityControl.data('visible') === true;
            try {
                const layer = LayerManager.singleton().setVisibility(id, !visible);
                visibilityControl.data('visible', !visible);
            } catch(e) {
                throw e;
            }
        });

        controlHolder.append(renameLayerControl);
        controlHolder.append(visibilityControl);

        return controlHolder;
    }

    private addLayerAlphaControl(): JQuery<HTMLElement> {
        const layerAlphaGroup: JQuery<HTMLDivElement> = <JQuery<HTMLDivElement>> $("<div/>", { class: 'swatch-group' });

        /** Layer minimum alpha icon */
        const alphaSliderMinInfo: JQuery<HTMLSpanElement> = <JQuery<HTMLSpanElement>> $("<span/>", { class: 'slider-min', text: '0' });

        /** Layer Size slider */
        const alphaSlider: JQuery<HTMLInputElement> = <JQuery<HTMLInputElement>> $("<input/>", {
            type: 'range',
            min: 0,
            max: 1,
            step: 0.01,
            value: 1
        });

        alphaSlider.on("input", function(e) {
            const layer = LayerManager.singleton().getSelected();
            if(layer !== null) {
                const id = layer.getId();
                if(id !== null) {
                    LayerManager.singleton().setAlpha(id, parseFloat(<string> alphaSlider.val() || '1'));
                }
            }
        });

        StudioEventBus.subscribe(LayersPanelEvents.LAYER_ALPHA_RESET, (event: JQuery.Event, data: Layer) => {
            const layer = LayerManager.singleton().getSelected();
            if(layer !== null && layer.getId() === data.getId()) {
                alphaSlider.val(layer.Alpha); 
            }
        });

        /** Layer maximum alpha icon */
        const alphaSliderMaxInfo: JQuery<HTMLSpanElement> = <JQuery<HTMLSpanElement>> $("<span/>", { class: 'slider-max', text: '100' });
        
        layerAlphaGroup.append(alphaSliderMinInfo);
        layerAlphaGroup.append(alphaSlider);
        layerAlphaGroup.append(alphaSliderMaxInfo);

        return layerAlphaGroup;
    }  

    private onRenameHandler(parent: JQuery<HTMLElement>): void {
        try {
            const id: string = parent.data('id');
            const name: string = parent.children().first().text();
            const layer: Layer = LayerManager.singleton().get(id);

            const nameInput = $("<input/>", { type: 'text', value: name, class: 'layer-input' });
            nameInput.on('blur', e => {
                layer.rename(<string> nameInput.val() || "Undefined");
                LayerManager.singleton().update(layer);

                nameInput.remove();
                parent.children().first().removeClass("hidden");
            });

            nameInput.on('keyup', e => {
                const code: number = e.keyCode || e.charCode || e.which;
                if(code == 13) {
                    layer.rename(<string> nameInput.val() || "Undefined");
                    LayerManager.singleton().update(layer);
                    
                    nameInput.remove();
                    parent.children().first().removeClass("hidden");
                }
            });
            
            parent.append(nameInput);
            parent.children().first().addClass("hidden");

            nameInput.focus();
        } catch(e) {}
    }

    private addLayerAtEnd(id: string, name: string): void {
        const layer: JQuery<HTMLDivElement> = <JQuery<HTMLDivElement>> $("<div/>", { 'data-id': id, class: 'layer' });
        const layerTitle: JQuery<HTMLSpanElement> = <JQuery<HTMLSpanElement>> $("<span/>", { html: name });

        layerTitle.click(e => {
            LayerManager.singleton().setSelected(id);
        });

        layerTitle.dblclick(e => {
            this.onRenameHandler($(e.target).parent());
        });

        layer.append(layerTitle);
        layer.append(this.addLayerControls());

        this.layerHolder.append(layer);
        this.layersDom.set(id, layer);
        
        StudioEventBus.publish(LayersPanelEvents.LAYER_ADDED, { id: id });
        LayerManager.singleton().setSelected(id);
    }
    
    private addLayerAtStart(id: string, name: string): void {
        const layer: JQuery<HTMLDivElement> = <JQuery<HTMLDivElement>> $("<div/>", { 'data-id': id, class: 'layer' });
        const layerTitle: JQuery<HTMLSpanElement> = <JQuery<HTMLSpanElement>> $("<span/>", { html: name });

        layerTitle.click(e => {
            LayerManager.singleton().setSelected(id);
        });

        layerTitle.dblclick(e => {
            this.onRenameHandler($(e.target).parent());
        });

        layer.append(layerTitle);
        layer.append(this.addLayerControls());

        this.layerHolder.prepend(layer);
        this.layersDom.set(id, layer);
        
        StudioEventBus.publish(LayersPanelEvents.LAYER_ADDED, { id: id });
        LayerManager.singleton().setSelected(id);
    }

    private renameLayer(id: string, name: string): void {
        if(this.layersDom.has(id)) {
            const selectedLayer = this.layersDom.get(id);
            
            if(selectedLayer !== undefined)
                selectedLayer.children().first().text(name);
        } else {
            throw "Layer doesn't exists";
        }
    }
    
    private selectLayer(id: string): void {
        if(this.layersDom.has(id)) {
            if(this.selectedLayer !== null && this.selectedLayer !== undefined)
                this.selectedLayer.removeClass("layer-selected");

            const nextLayer = this.layersDom.get(id);
            if(nextLayer !== undefined) {
                this.selectedLayer = nextLayer;
                this.selectedLayer.addClass("layer-selected");
            } 
        } else {
            throw "Layer doesn't exists";
        }
    }

    private deleteLayer(id: string): void {
        
        if(this.layersDom.has(id)) {
            const layerToMatch = this.layersDom.get(id);
            if(layerToMatch !== undefined && layerToMatch === this.selectedLayer ) {
                let i = this.getFirstKeyExcept(id, this.layersDom);
                LayerManager.singleton().setSelected(i);
            }
            
            if(layerToMatch !== undefined)
                layerToMatch.remove();
            
            this.layersDom.delete(id);
        } else {
            throw "Layer doesn't exists";
        }
    }

    private getFirstKeyExcept(key: string, obj: Map<string, JQuery<HTMLElement>> ): string|null {
        const keys = obj.keys();
        let firstKey = keys.next();

        if(firstKey.done) return null;

        if(firstKey.value == key) firstKey = keys.next();
        
        if(firstKey.done) return null;

        return firstKey.value;
    }

    public initialize(panel: Panel): void {
        this.panel = panel;
        this.layerDomHolder = this.panel.addSubPanel("Layers");

        StudioEventBus.subscribe(IBusType.LAYER.toString() + ManagerEvents.ADD.toString(), (event: JQuery.Event, data: Layer) => {
            const _id = data.getId();
            if(_id !== null)
                this.addLayerAtStart(_id, data.getName());
        });

        StudioEventBus.subscribe(IBusType.LAYER.toString() + ManagerEvents.UPDATE.toString(), (event: JQuery.Event, data: Layer) => {
            const _id = data.getId();
            if(_id !== null)
                this.renameLayer(_id, data.getName());
        });

        StudioEventBus.subscribe(IBusType.LAYER.toString() + ManagerEvents.REMOVE.toString(), (event: JQuery.Event, data: Layer) => {
            const _id = data.getId();
            if(_id !== null)
                this.deleteLayer(_id);
        });

        this.addTopControls();
        this.addLayersHolder();
        
        /** Local events */
        StudioEventBus.subscribe(LayerManagerEvents.LAYER_SELECTED, (event: JQuery.Event, data: Layer|null) => {
            if(data == null) {
                StudioEventBus.publish(LayersPanelEvents.LAYER_SELECTED, null);
                return;   
            };

            const id = data.getId();
            if(id !== null) {
                this.selectLayer(id);
                StudioEventBus.publish(LayersPanelEvents.LAYER_SELECTED, data);
                StudioEventBus.publish(LayersPanelEvents.LAYER_ALPHA_RESET, data);
            }
        });

    }

}

export enum LayersPanelEvents {
    LAYER_ADDED = "layerpanel:layer-added",
    LAYER_SELECTED = "layerpanel:layer-selected",
    LAYER_ALPHA_RESET = "layerpanel:layer-alpha-reset",
}

export const LayersPanelModule: LayersPanel = new LayersPanel();