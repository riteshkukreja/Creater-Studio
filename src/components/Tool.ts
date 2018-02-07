import { EventMessageItem } from "../interfaces/EventMessageItem";
import { ITool } from "../interfaces/ITool";
import { IClonableItem } from "../interfaces/IClonableItem";
import { Color } from "./Color";
import { Position } from "./Position";

export abstract class Tool extends EventMessageItem implements ITool, IClonableItem<Tool> {
    
    abstract initialize(): void;

    abstract reset(): void;

    abstract async draw(position: Position, color: Color, context: CanvasRenderingContext2D, width: number, height: number): Promise<void>;

    abstract getLabel(): string;

    abstract clone(): Tool;

    abstract getDom(): JQuery<HTMLElement>;
}