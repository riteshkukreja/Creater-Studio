import { Position } from "../components/Position";
import { Color } from "../components/Color";
import { InvalidArgException } from "../exceptions/InvalidArgException";

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
    return "item-" + (new Date()).getTime().toString();
}

export const MatrixToLinearPositions = (position: Position, rowSize: number): number => {
    return (position.y * rowSize + position.x);
}

export const ImageDataColorAt = (imageData: ImageData, position: Position, width: number, height: number): Color => {
    const pos: number = 4 * MatrixToLinearPositions(position, width);

    if(pos < 0 || pos >= imageData.data.length)
        throw new InvalidArgException("Index out of bound execption");

    const color: Color = new Color(
        imageData.data[pos], //red
        imageData.data[pos + 1], //green
        imageData.data[pos + 2], //blue
        RangeMap(imageData.data[pos + 3], 0, 255, 0, 1) //alpha
    );

    return color;
}

export const SetImageDataColor = (imageData: ImageData, position: Position, width: number, height: number, color: Color): void => {
    const pos: number = 4 * MatrixToLinearPositions(position, width);

    if(pos < 0 || pos >= imageData.data.length)
        throw new InvalidArgException("Index out of bound execption");

    imageData.data[pos] = color.Red; //red
    imageData.data[pos + 1] = color.Green; //green
    imageData.data[pos + 2] = color.Blue; //blue
    imageData.data[pos + 3] = RangeMap(color.Alpha, 0, 1, 0, 255); //alpha
}

export const ColorDiff = (color1: Color, color2: Color): Color => {
    return new Color(
        Math.abs(color1.Red - color2.Red),
        Math.abs(color1.Green - color2.Green),
        Math.abs(color1.Blue - color2.Blue),
        Math.abs(color1.Alpha - color2.Alpha)
    );
}

export const BoundingBox = (imageData: ImageData, position: Position, width: number, height: number, callback?: (position: Position, color: Color) => void): Position[] => {
    const clickedPositionColor: Color = ImageDataColorAt(imageData, position, width, height);
    const colorDelta: number = 10; // delta between colors while selectin border of box
    
    const queue: Queue<Position> = new Queue<Position>([position]);
    const borderPositions: Position[] = [];
    const traversed: Map<string, boolean> = new Map<string, boolean>();

    while(!queue.empty()) {
        const pos = queue.pop();

        if(pos !== null) {
            try {
                /** Check if already travered */
                if(traversed.has(pos.toString())) continue;

                traversed.set(pos.toString(), true);

                /** Retrieve the color at this position */
                const color = ImageDataColorAt(imageData, pos, width, height);

                /** Calculate delta between colors */
                const diffColor = ColorDiff(clickedPositionColor, color);
                const delta = Math.max(diffColor.Red, Math.max(diffColor.Blue, diffColor.Green));

                /** if color is within the delta change, then move to its surrounding positions */
                if(delta <= colorDelta) {
                    /** Execute callback */
                    if(typeof callback == "function")
                        callback(pos, color);

                    /** Push surrounding positions to queue */
                    if(pos.x > 0) {
                        queue.push(new Position(pos.x - 1, pos.y ));
                    }

                    if(pos.x < width-1) {
                        queue.push(new Position(pos.x + 1, pos.y ));
                    }

                    if(pos.y > 0) {
                        queue.push(new Position(pos.x, pos.y - 1 ));
                    }

                    if(pos.y < height-1) {
                        queue.push(new Position(pos.x, pos.y + 1 ));
                    }

                }
                /** else consider this position as border and stop propogation */
                else {
                    borderPositions.push(pos);
                }
            } catch(e) {
                /** do nothing */
                console.error(e);
            }

        } else {
            break;
        }
    }

    return borderPositions;
}

export class Queue<T> {
    private items: T[];
    
    constructor(items?: T[]) {
        this.items = items || [];
    }

    push(...items: T[]): void {
        this.items = this.items.concat(items);
    }

    pop(): T|null {
        const item = this.items.shift();
        return item || null;
    }

    front(): T|null {
        if(this.items.length > 0) {
            return this.items[0];
        }

        return null;
    }

    size(): number {
        return this.items.length;
    }

    empty(): boolean {
        return this.items.length == 0;
    }
}

export const getCursorAngle = (position1: Position|null, position2: Position|null): number => {
    if(!position1 || !position2) return 0;
    
    return position1.angle(position2);
}

export class WorkerRunner {
    private worker: Worker|null = null;

    constructor(url: string, callback: (data: any) => void) {
        this.worker = new Worker(url);

        this.worker.addEventListener('message', (e: any) => {
            const data = e.data;
            callback(data);
        });
    }

    timeout(time: number) {
        setTimeout(() => {
            if(this.worker !== null)
                this.worker.terminate();
        }, time);

        return this;
    }

    send(data: any) {
        if(this.worker !== null) {
            this.worker.postMessage(data);
        }

        return this;
    }

    running(): boolean {
        return this.worker !== null;
    }

    waitFor(time: number): void {
        //Promise. 
    }
}

export const CreateWorker = async(url: string, data: any): Promise<any> => {
    return new Promise(function(resolve, reject) {
        var v = new Worker(url);
        v.postMessage(data);
        v.onmessage = function(event){
            // If you report errors via messages, you'd have a branch here for checking
            // for an error and either calling `reject` or `resolve` as appropriate.
            resolve(event.data);
        };
        v.onerror = function(event) {
            // Rejects the promise using the error associated with the ErrorEvent
            reject(event.error);
        };
    });
}