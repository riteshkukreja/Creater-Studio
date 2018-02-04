import { Manager } from "./Manager";
import { Brush } from "../components/Brush";
import { IBusType } from "../interfaces/IBusType";
import { StudioEventBus } from "../components/EventBus";
import { Position } from "../components/Position";
import { Color } from "../components/Color";
import { ColorLoaderModule } from "../ui/loaders/ColorLoader";

export class BrushManager extends Manager<Brush> {
    private static self: BrushManager|null = null;
    private selectedBrush: Brush|null = null;
    private lastPosition: Position|null = null;
    private brushSize: number = 10;

    bootstrap(): void {
        super.bootstrap(IBusType.BRUSH);

        /** my events */
        StudioEventBus.subscribe(BrushManagerEvents.DRAW_BRUSH, (event: JQuery.Event, {position, context}) => {
            const color: Color = ColorLoaderModule.getSelected();
            this.drawBrush(position, color, context);

            StudioEventBus.publish(BrushManagerEvents.DRAW_POINT_SUCCESS, position);
        });

        StudioEventBus.subscribe(BrushManagerEvents.DRAW_BRUSH_END, (event: JQuery.Event, {position, context}) => {
            this.lastPosition = null;
        });
    }

    add(brush: Brush): void {
        super.add(brush);
    }

    public static singleton(): BrushManager {
        if(this.self == null) {
            this.self = new BrushManager();
            this.self.bootstrap();
        }

        return this.self;
    }

    public setSelected(id: string|null): void {
        try {
            this.selectedBrush = id == null ? null : this.get(id);
            StudioEventBus.publish(BrushManagerEvents.BRUSH_SELECTED, this.selectedBrush);
        } catch(e) {
            throw e;
        }
    }

    public getSelected(): Brush|null {
        return this.selectedBrush;
    }

    public setSize(size: number): void {
        this.brushSize = size;
    }

    public getSize(): number {
        return this.brushSize;
    }

    public getAllBrushes(callback: (brush: Brush, id: string) => void): void {
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

    private drawBrush(position: Position, color: Color, context: CanvasRenderingContext2D): void {
        if(this.selectedBrush !== null) {
            this.selectedBrush.draw(this.lastPosition, position, this.brushSize, color, context);
            this.lastPosition = position;
        }
    }

}

export enum BrushManagerEvents {
    DRAW_BRUSH = "brushmanager:draw-brush",
    DRAW_POINT_SUCCESS = "brushmanager:draw-point-success",
    DRAW_BRUSH_END = "brushmanager:draw-brush-end",
    BRUSH_SELECTED = "brushmanager:brush-selected"
}