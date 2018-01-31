import { StudioEventBus } from '../components/EventBus';
import { Layer } from '../components/Layer';
import * as $ from 'jquery';

export class LayerManager {
    private layers: Object = {}
    private idCount: number = 1;

    private selectedLayer: Layer|null;

    constructor() {
        StudioEventBus.subscribe("layer-selected", (event: JQuery.Event, data: any) => {
            if(data.id in this.layers)
                this.selectedLayer = this.get(data.id);
            else
                this.selectedLayer = null;
        });
    }

    add(layer: Layer): void {
        if(layer instanceof Layer) {
            this.layers[this.idCount] = layer;
            layer.setId(this.idCount);
            this.idCount++;

            StudioEventBus.publish("layer-add", { id: this.idCount-1, name: layer.getName() });
        } else {
            throw "Not a this.layers object";
        }
    }

    update(id: number, canvas: HTMLCanvasElement, context: CanvasRenderingContext2D, width: number, height: number): void {
        if(id in this.layers) {
            this.layers[id].update(canvas, context, width, height);
        } else {
            throw "Not a valid layer";
        }
    }

    get(id: number): Layer {
        if(id in this.layers) {
            return this.layers[id];
        } else {
            throw "Not a valid layer";
        }
    }
    
    rename(id: number, name: string): void {
        if(id in this.layers) {
            this.layers[id].rename(name);

            StudioEventBus.publish("layer-rename", { id: id, name: name });
        } else {
            throw "Not a valid layer";
        }
    }
    
    delete(id: number): void {
        if(id in this.layers) {
            delete this.layers[id];
            
            StudioEventBus.publish("layer-deleted", { id: id });
        } else {
            throw "Not a valid layer";
        }
    }

    getSelected(): Layer|null {
        return this.selectedLayer;
    }

    getAllLayers(callback: (layer: Layer, id: number) => void): void {
        for(var key in this.layers) {
            callback(this.layers[key], parseInt(key));
        }
    }

    setVisibility(id: number, visible: boolean): void {
        if(id in this.layers) {
            this.layers[id].setVisibility(visible);
            
            StudioEventBus.publish("layer-visiblity-changed", { id: id, visible: visible });
        } else {
            throw "Not a valid layer";
        }
    }

    setAlpha(id: number, alpha: number) {
        if(id in this.layers) {
            this.layers[id].setAlpha(alpha);
            
            StudioEventBus.publish("layer-alpha-changed", { id: id, alpha: alpha });
        } else {
            throw "Not a valid layer";
        }
    }
}

export const LayerManagerModule: LayerManager = new LayerManager();