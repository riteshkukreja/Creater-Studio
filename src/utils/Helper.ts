import { Position } from "../components/Position";
import { Color } from "../components/Color";

/**
 * Map a value from one range to another
 * @param val  value in source range to map in target range
 * @param minA minimum of source range
 * @param maxA maximum of source range
 * @param minB minimum of target range
 * @param maxB maximum of target range
 */
export const RangeMap = (val: number, minA: number, maxA: number, minB: number, maxB: number): number => {
    return (val - minA) * (maxB - minB) / (maxA - minA) + minB;
}

export const PointsOnLineBetween  = (pos1: Position, pos2: Position, offset?: number): Position[] => {
    const points: Position[] = [];
    const increment = offset || 1;

    /** Vertical line */
    if(pos1.x === pos2.x) {
        for(let y = Math.min(pos1.y, pos2.y) + 1; y < Math.max(pos1.y, pos2.y); y+=increment) {
            points.push(new Position(pos1.x, y));
        }
    } else {
        const m = (pos2.y - pos1.y) / (pos2.x - pos1.x);
        const b = pos1.y - (m * pos1.x);

        /** Check if y range is larger or x */
        const diffX = Math.max(pos1.x, pos2.x) - Math.min(pos1.x, pos2.x);
        const diffY = Math.max(pos1.y, pos2.y) - Math.min(pos1.y, pos2.y);

        if(Math.abs(diffX) > Math.abs(diffY)) {
            /** X is greater */
            for(let x = Math.min(pos1.x, pos2.x) + 1; x < Math.max(pos1.x, pos2.x); x += increment) {
                const y = Math.floor((m * x) + b);
                points.push(new Position(x, y));
            }
        } else {
            /** Y is greater */
            for(let y = Math.min(pos1.y, pos2.y) + 1; y < Math.max(pos1.y, pos2.y); y += increment) {
                const x = Math.floor((y - b) / m);
                points.push(new Position(x, y));
            }
        }
    }

    return points;
}

export const getRandomNumber = (min: number,max: number): number => {
    return Math.floor(Math.random() * (max - min)) + min;
}

export const getRandomColor = (): Color => {
    return new Color(getRandomNumber(0, 255),  getRandomNumber(0, 255),  getRandomNumber(0, 255), 1);
}

export const uuidGenerator = (): string => {
    return (new Date()).getTime().toString();
}