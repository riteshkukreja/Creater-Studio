import { Position } from './Position';
import { Color } from './Color';
import { RangeMap, PointsOnLineBetween, getRandomNumber } from '../utils/Helper';
import { EventMessageItem } from '../interfaces/EventMessageItem';
import { IClonableItem } from '../interfaces/IClonableItem';

export class Brush extends EventMessageItem implements IClonableItem<Brush> {
    private label: string;

    private setup: (context: CanvasRenderingContext2D) => void;
    private drawer: (lastPosition: Position|null, position: Position, size: number, color: Color, context: CanvasRenderingContext2D) => void;
    
    constructor(label: string, setupCallback: ((context) => void)|null, drawCallback: (lastPosition: Position|null, position: Position, size: number, color: Color, context: CanvasRenderingContext2D) => void) {
        super();
        this.label = label || "sample brush";

        this.setup = setupCallback || function(context) {
            context.globalCompositeOperation = 'source-over';
        }

        this.drawer = drawCallback;
    }

    draw(lastPosition: Position|null, position: Position, size: number, color: Color, context: CanvasRenderingContext2D): void {
        this.setup(context);

        // context.lineWidth = 2 * size;
        // context.lineTo(position.x, position.y);
        // context.strokeStyle = color.toString();
        // context.stroke();
        // context.beginPath();
            
        context.save();
        context.globalAlpha = color.Alpha;

        if(lastPosition !== null && lastPosition !== undefined) {
            PointsOnLineBetween(lastPosition, position, size/4)
                .map(point => {
                    this.drawer(lastPosition, point, size, color, context);
                    lastPosition = point;
                    context.beginPath();
                });
        }


        this.drawer(lastPosition, position, size, color, context);
        context.globalAlpha = 1;
        context.restore();

        //context.closePath();

        context.beginPath();
        context.moveTo(position.x, position.y);
    }

    getLabel(): string {
        return this.label;
    }

    clone(): Brush {
        const brush = new Brush(this.label, this.setup, this.drawer);
        const id = this.getId();
        
        if(id !== null)
            brush.setId(id);
        
        return brush;
    }
}

/** Brushes */
export const RoundBrush = new Brush("Round Brush", null, (lastPosition: Position|null, position: Position, size: number, color: Color, context: CanvasRenderingContext2D) => {
    context.fillStyle = color.toString();
    context.arc(position.x, position.y, size, 0, 2*Math.PI);
    context.fill();
});

export const SquareBrush = new Brush("Square Brush", null, (lastPosition: Position|null, position: Position, size: number, color: Color, context: CanvasRenderingContext2D) => {
    context.fillStyle = color.toString();
    context.rect(position.x - size, position.y - size, size * 2, size * 2);
    context.fill();
});

export const TriangleBrush = new Brush("Triangle Brush", null, (lastPosition: Position|null, position: Position, size: number, color: Color, context: CanvasRenderingContext2D) => {
    context.fillStyle = color.toString();
    context.beginPath();
    context.moveTo(position.x, position.y - size);
    context.lineTo(position.x + size, position.y + size);
    context.lineTo(position.x - size, position.y + size);
    context.closePath();
    context.fill();
});

export const ClearBrush = new Brush("Clear Brush", 
    (context: CanvasRenderingContext2D) => {
        context.globalCompositeOperation = 'destination-out';
    }, 
    (lastPosition: Position|null, position: Position, size: number, color: Color, context: CanvasRenderingContext2D) => {
        context.arc(position.x, position.y, size, 0, 2*Math.PI);
        context.fill();
});

export const FadedRoundBrush = new Brush("Faded Round Brush", null, (lastPosition: Position|null, position: Position, size: number, color: Color, context: CanvasRenderingContext2D) => {
    const alpha_radius = [1, 0.9, 0.8, 0.2];
    const globalAlpha = context.globalAlpha;
    /**
     * create circles with larger radius and smaller alpha first
     * so size of circles keeps decreasing and alpha keeps increasing
     */
    alpha_radius.forEach((val, pos) => {
        const radius = RangeMap(pos, 0, alpha_radius.length-1, 0, size);
        const _color = color.clone();
        _color.Alpha = RangeMap(val, 0, 1, 0, _color.Alpha);

        context.fillStyle = _color.toString();
        context.globalAlpha = _color.Alpha;
        context.arc(position.x, position.y, radius, 0, 2*Math.PI);
        context.fill();
    });

    context.globalAlpha = globalAlpha;
});

export const DottedRoundBrush = new Brush("Dotted Round Brush", null, (lastPosition: Position|null, position: Position, size: number, color: Color, context: CanvasRenderingContext2D) => {
    const _radius = [0.7, 0.3, 0.2, 0.2, 0.15];
    const _positions = [
        new Position(position.x + 0.3*size, position.y + 0.3 * size), 
        new Position(position.x - 0.7*size, position.y - 0.7*size), 
        new Position(position.x + 0.7*size, position.y - 0.7*size),
        new Position(position.x - 0.7*size, position.y),
        new Position(position.x - 0.5*size, position.y + 0.7*size)
    ];
    /**
     * create circles with larger radius and smaller alpha first
     * so size of circles keeps decreasing and alpha keeps increasing
     */
    _positions.forEach((val, pos) => {
        const radius = _radius[pos] * size;

        context.fillStyle = color.toString();
        context.arc(val.x, val.y, radius, 0, 2*Math.PI);
        context.fill();
        context.beginPath();
    });
});

export const RandomJitterBrush = new Brush("Random Jitter Brush", null, (lastPosition: Position|null, position: Position, size: number, color: Color, context: CanvasRenderingContext2D) => {
    const particals: number = 5;
    const _radius: number = size/5;
    const _positions: Position[] = [];

    for(let pos = 0; pos < particals; pos++) {
        const partical: Position = new Position(
            getRandomNumber(position.x - size, position.x + size),
            getRandomNumber(position.y - size, position.y + size)
        );

        _positions.push(partical);
    }
    
    /**
     * create circles with larger radius and smaller alpha first
     * so size of circles keeps decreasing and alpha keeps increasing
     */
    _positions.forEach((val, pos) => {
        const radius = getRandomNumber(1, _radius);

        context.fillStyle = color.toString();
        context.arc(val.x, val.y, radius, 0, 2*Math.PI);
        context.fill();
        context.beginPath();
    });
});
