import { Color } from "../components/Color";
import { Position } from "../components/Position";
import { ITool } from "../interfaces/ITool";
import { IClonableItem } from "../interfaces/IClonableItem";
import { IEventMessageItem, EventMessageItem } from "../interfaces/EventMessageItem";
import { Tool } from "../components/Tool";
import { BoundingBox, RangeMap, getRandomNumber, WorkerRunner, CreateWorker } from "../utils/Helper";
import $ = require("jquery");

export class PaintTool extends Tool {
    private toolIcon: string = "https://storage.googleapis.com/material-icons/external-assets/v4/icons/svg/ic_format_paint_white_48px.svg";
    private running: boolean = false;

    constructor() {
        super();
    }

    initialize(): void {
        // do nothing
    }

    reset(): void {
        // do nothing
    }

    async draw(position: Position, color: Color, context: CanvasRenderingContext2D, width: number, height: number): Promise<void> {
        if(this.running) return;

        this.running = true;
        context.fillStyle = color.toString();
        const imageData: ImageData = context.getImageData(0, 0, width, height);

        try {
            const msg = await CreateWorker('./dist/boundingbox.js', {
                imageData,
                position, 
                width, 
                color,
                height
            });

            context.putImageData(msg.imageData, 0, 0);
            this.running = false;

        } catch(e) {
            console.error(e);
        }
    }

    getLabel(): string {
        return "Paint Tool";
    }

    clone(): PaintTool {
        const tool = new PaintTool();
        const _id = this.getId();
        if(_id !== null)
            tool.setId(_id);
        return tool;
    }

    getDom(): JQuery<HTMLElement> {
        const i = $("<img/>", { src: `${this.toolIcon}` });
        return i;
    }

}