import { Color } from "./Color";
import { Position } from "./Position";
import { ITool } from "../interfaces/ITool";
import { IClonableItem } from "../interfaces/IClonableItem";
import { IEventMessageItem, EventMessageItem } from "../interfaces/EventMessageItem";
import { Tool } from "./Tool";
import { BoundingBox } from "../utils/Helper";

export class PaintTool extends Tool {
    constructor() {
        super();
    }

    initialize(): void {
        // do nothing
    }

    draw(position: Position, size: number, color: Color, context: CanvasRenderingContext2D, width: number, height: number): void {
        context.fillStyle = color.toString();
        /** Calculate bounding box from the position of click */
        BoundingBox(context, position, width, height, (pos: Position, color: Color): void => {
            /** fill the area with given color */
            context.beginPath();
            context.arc(pos.x, pos.y, 0.5, 0, 2*Math.PI);
            context.fill();
        });
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

}