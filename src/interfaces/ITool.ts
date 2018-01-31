import { Color } from "../components/Color";
import { Position } from "../components/Position";

export interface ITool {
    initialize(): void;
    draw(position: Position, size: number, color: Color, context: CanvasRenderingContext2D): void;
    getLabel(): string;
}