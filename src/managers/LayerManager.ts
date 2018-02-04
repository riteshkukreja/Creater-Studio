import { StudioEventBus } from '../components/EventBus';
import { Layer } from '../components/Layer';
import * as $ from 'jquery';
import { IBusType } from '../interfaces/IBusType';
import { Manager } from './Manager';
import { EventBusManager } from './EventBusManager';
import { LayersPanelEvents } from '../ui/LayersPanel';

export class LayerManager extends Manager<Layer> {
    private selectedLayer: Layer|null;
    private static self: LayerManager|null = null;

    bootstrap() {
        super.bootstrap(IBusType.LAYER);
    }

    public static singleton(): LayerManager {
        if(this.self === null) {
            this.self = new LayerManager();
            this.self.bootstrap();
        }

        return this.self;
    }

    updateLayer(id: string, canvas: HTMLCanvasElement, context: CanvasRenderingContext2D, width: number, height: number): void {
        try {
            const layer = this.get(id);
            layer.update(canvas, context, width, height);
            this.update(layer);
        } catch(e) {
            throw e;
        }
    }

    getSelected(): Layer|null {
        return this.selectedLayer;
    }

    setSelected(id: string|null) {
        try {
            this.selectedLayer = id == null ? null : this.get(id);
            StudioEventBus.publish(LayerManagerEvents.LAYER_SELECTED, this.selectedLayer);
        } catch(e) {
            throw e;
        }
    }

    getAllLayers(callback: (layer: Layer, id: string) => void): void {
        try {
            const itr = this.iterator();
            let item = itr.next();
            while(!item.done) {
                callback(item.value[1], item.value[0]);
                item = itr.next();
            }
        } catch(e) {
            throw e;
        }
    }

    setVisibility(id: string, visible: boolean): void {
        try {
            const layer = this.get(id);
            layer.setVisibility(visible);
            this.update(layer);

            StudioEventBus.publish(LayerManagerEvents.VISIBILITY_CHANGED, layer.clone());
        } catch(e) {
            throw e;
        }
    }

    setAlpha(id: string, alpha: number) {
        try {
            const layer = this.get(id);
            layer.setAlpha(alpha);
            this.update(layer);

            StudioEventBus.publish(LayerManagerEvents.ALPHA_CHANGED, layer.clone());
        } catch(e) {
            throw e;
        }
    }
}

export enum LayerManagerEvents {
    LAYER_SELECTED = "layermanager:layer-selected",
    ALPHA_CHANGED = "layermanager:alpha-changed",
    VISIBILITY_CHANGED = "layermanager:visibility-changed"
}