export class Position {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = parseInt(x + '');
        this.y = parseInt(y + '');
    }

    distance(pos: Position): number {
        return Math.sqrt(Math.pow(this.x - pos.x, 2) + Math.pow(this.y - pos.y, 2));
    }

    angle(pos: Position): number {
        return Math.atan2(pos.y - this.y, pos.x - this.x);
    }
}