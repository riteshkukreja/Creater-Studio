import { Color } from "../components/Color";
import { Position } from "../components/Position";
import { ITool } from "../interfaces/ITool";
import { IClonableItem } from "../interfaces/IClonableItem";
import { IEventMessageItem, EventMessageItem } from "../interfaces/EventMessageItem";
import { Tool } from "../components/Tool";
import { BoundingBox } from "../utils/Helper";
import { BrushManager } from "../managers/BrushManager";
import $ = require("jquery");

export class BrushTool extends Tool {
    private toolIcon:string = "https://storage.googleapis.com/material-icons/external-assets/v4/icons/svg/ic_brush_white_48px.svg";

    constructor() {
        super();
    }

    initialize(): void {
        // do nothing
    }

    reset(): void {
        // reset brush last position
        BrushManager.singleton().reset();
    }

    async draw(position: Position, color: Color, context: CanvasRenderingContext2D, width: number, height: number): Promise<void> {
        /** Draw brush */
        BrushManager.singleton().drawBrush(position, color, context);
    }

    getLabel(): string {
        return "Brush Tool";
    }

    clone(): BrushTool {
        const tool = new BrushTool();
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