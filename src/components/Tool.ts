import { Color } from "./Color";
import { Position } from "./Position";

export interface ITool {
    initialize(): void;
    draw(position: Position, size: number, color: Color, context: CanvasRenderingContext2D): void;
    getLabel(): string;
}