import { Color } from "../components/Color";
import { Position } from "../components/Position";

export interface ITool {
    initialize(): void;
    draw(position: Position, color: Color, context: CanvasRenderingContext2D, width: number, height: number): void;
    getLabel(): string;
    getDom(): JQuery<HTMLElement>;
}