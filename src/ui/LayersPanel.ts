import { Panel, LayerFilterPanel } from "./components/Panel";
import { StudioEventBus } from "../components/EventBus";
import { LayerManagerModule } from "../managers/LayerManager";
import { Layer } from "../components/Layer";
import * as $ from 'jquery';
import "jquery-ui-bundle";

export class LayersPanel {
    private panel: Panel;
    private layersDom: Map<number, JQuery<HTMLElement>> = new Map<number, JQuery<HTMLElement>>();

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
            LayerManagerModule.add(new Layer("Untitled Layer"));
        });

        const addFilterControl: JQuery<HTMLElement> = $("<i/>", { class: 'recordIcon' });
        addFilterControl.click(e => {
            // TODO create filter
            StudioEventBus.publish('add-filter', LayerManagerModule.getSelected());
        });

        const deleteControl: JQuery<HTMLElement> = $("<i/>", { class: 'deleteIcon' });
        deleteControl.click(e => {
            // TODO delete layer
            const layer = LayerManagerModule.getSelected();
            if(layer !== null) {
                const id = layer.getId();
                if(id !==  null)
                    LayerManagerModule.delete(id);
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
            const id: number = $(e.target).parent().parent().data('id');
            LayerManagerModule.setVisibility(id, !LayerManagerModule.get(id).Visibility);
            visibilityControl.data('visible', LayerManagerModule.get(id).Visibility);
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
            const layer = LayerManagerModule.getSelected();
            if(layer !== null) {
                const id = layer.getId();
                if(id !== null) {
                    LayerManagerModule.setAlpha(id, parseFloat(<string> alphaSlider.val() || '1'));
                }
            }
        });

        StudioEventBus.subscribe("layer-alpha-reset", (event, data) => {
            const layer = LayerManagerModule.getSelected();
            if(layer !== null) {
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
        const id: number = parent.data('id');
        const name: string = parent.children().first().text();

        const nameInput = $("<input/>", { type: 'text', value: name, class: 'layer-input' });
        nameInput.on('blur', e => {
            LayerManagerModule.rename(id, <string> nameInput.val() || "Undefined");

            nameInput.remove();
            parent.children().first().removeClass("hidden");
        });

        nameInput.on('keyup', e => {
            const code: number = e.keyCode || e.charCode || e.which;
            if(code == 13) {
                LayerManagerModule.rename(id, <string> nameInput.val() || "Undefined");
                
                nameInput.remove();
                parent.children().first().removeClass("hidden");
            }
        });
        
        parent.append(nameInput);
        parent.children().first().addClass("hidden");

        nameInput.focus();
    }

    private addLayerAtEnd(id: number, name: string): void {
        const layer: JQuery<HTMLDivElement> = <JQuery<HTMLDivElement>> $("<div/>", { 'data-id': id, class: 'layer' });
        const layerTitle: JQuery<HTMLSpanElement> = <JQuery<HTMLSpanElement>> $("<span/>", { html: name });

        layerTitle.click(e => {
            StudioEventBus.publish("layer-selected", { id: id });
        });

        layerTitle.dblclick(e => {
            this.onRenameHandler($(e.target).parent());
        });

        layer.append(layerTitle);
        layer.append(this.addLayerControls());

        this.layerHolder.append(layer);
        this.layersDom.set(id, layer);
        
        StudioEventBus.publish("layer-added", { id: id });
        StudioEventBus.publish("layer-selected", { id: id });
    }
    
    private addLayerAtStart(id: number, name: string): void {
        const layer: JQuery<HTMLDivElement> = <JQuery<HTMLDivElement>> $("<div/>", { 'data-id': id, class: 'layer' });
        const layerTitle: JQuery<HTMLSpanElement> = <JQuery<HTMLSpanElement>> $("<span/>", { html: name });

        layerTitle.click(e => {
            StudioEventBus.publish("layer-selected", { id: id });
        });

        layerTitle.dblclick(e => {
            this.onRenameHandler($(e.target).parent());
        });

        layer.append(layerTitle);
        layer.append(this.addLayerControls());

        this.layerHolder.prepend(layer);
        this.layersDom.set(id, layer);
        
        StudioEventBus.publish("layer-added", { id: id });
        StudioEventBus.publish("layer-selected", { id: id });
    }

    private renameLayer(id: number, name: string): void {
        if(this.layersDom.has(id)) {
            const selectedLayer = this.layersDom.get(id);
            
            if(selectedLayer !== undefined)
                selectedLayer.children().first().text(name);
        } else {
            throw "Layer doesn't exists";
        }
    }
    
    private selectLayer(id: number): void {
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

    private deleteLayer(id: number): void {
        if(this.layersDom.has(id)) {
            const layerToMatch = this.layersDom.get(id);
            if(layerToMatch !== undefined && layerToMatch === this.selectedLayer ) {
                let i = this.getFirstKeyExcept(id, this.layersDom);
                StudioEventBus.publish("layer-selected", { id: i });
            }
            
            if(layerToMatch !== undefined)
                layerToMatch.remove();
            
                this.layersDom.delete(id);
        } else {
            throw "Layer doesn't exists";
        }
    }

    private getFirstKeyExcept(key: number, obj: any): string|null {
        const keys = Object.keys(obj);
        if(keys.length < 1 || (keys.length == 1 && keys[0] == key + "")) return null;

        if(keys.indexOf(key + "") > -1)
            keys.splice(keys.indexOf(key + ""), 1);

        return keys[0];
    }

    initialize(panel: Panel): void {
        this.panel = panel;
        this.layerDomHolder = this.panel.addSubPanel("Layers");

        StudioEventBus.subscribe("layer-add", (event: JQuery.Event, data: any) => {
            this.addLayerAtStart(data.id, data.name);
        });

        StudioEventBus.subscribe("layer-rename", (event: JQuery.Event, data: any) => {
            this.renameLayer(data.id, data.name);
        });
        
        StudioEventBus.subscribe("layer-selected", (event: JQuery.Event, data: any) => {
            if(data.id) {
                this.selectLayer(data.id);
                StudioEventBus.publish("layer-alpha-reset", null);
            }
        });

        StudioEventBus.subscribe("layer-deleted", (event: JQuery.Event, data: any) => {
            this.deleteLayer(data.id);
        });

        this.addTopControls();
        this.addLayersHolder();
    }

}

export const LayersPanelModule: LayersPanel = new LayersPanel();