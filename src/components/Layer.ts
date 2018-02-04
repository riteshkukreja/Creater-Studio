import * as $ from 'jquery';
import { IClonableItem } from '../interfaces/IClonableItem';
import { IEventMessageItem, EventMessageItem } from '../interfaces/EventMessageItem';

export class Layer extends EventMessageItem implements IClonableItem<Layer> {
    
    private name: string;

    private content: ImageData;
    private imageSrc: string;
    private visibility: boolean = true;
    private alpha: number  = 1;
    private image: HTMLImageElement;
    
    constructor(title: string) {
        super();
        this.name = title;
    }

    update(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D, width: number, height: number): void {
        this.content = context.getImageData(0, 0, width, height);
        this.imageSrc = canvas.toDataURL('image/png');
        this.image = <HTMLImageElement> $("<img/>", { src: this.imageSrc }).get(0);
    }

    get(): ImageData {
        return this.content;
    }

    rename(name: string): void {
        this.name = name;
    }

    setVisibility(visible: boolean): void {
        this.visibility = visible;
    }

    apply(context: CanvasRenderingContext2D, noAlpha?: boolean): void {
        if(this.image != null) {
            /** super slow */
            // for(let i = 0; i < content.data.length; i += 4) {
            //     content.data[i+3] = Math.floor(255 * this.alpha);
            // }
            // context.putImageData(content, 0, 0);

            /** Relatively fast */
            
            //let img = $("<img/>", { src: image });
            if(!noAlpha)
                context.globalAlpha = this.alpha;
            context.drawImage(this.image, 0, 0);
            context.globalAlpha = 1;
        }
    }

    applyDrawing(context: CanvasRenderingContext2D, width: number, height: number): void {
        if(this.image != null) {
            let alpha = this.alpha;
            this.image.addEventListener('load', () => {
                context.clearRect(0, 0, width, height);

                context.globalAlpha = alpha;
                context.drawImage(this.image, 0, 0);
                context.globalAlpha = 1;
            });
        }
    }

    getImageSrc(): string {
        return this.imageSrc;
    }

    setAlpha(al: number): void {
        this.alpha = al;
    }

    getName(): string {
        return this.name;
    }

    get Visibility(): boolean {
        return this.visibility;
    }

    get Alpha(): number {
        return this.alpha;
    }

    setImageSrc(source: string): void {
        this.imageSrc = source;
    }

    setImage(img: HTMLImageElement): void {
        this.image = img;
    }

    setImageContent(content: ImageData): void {
        this.content = content;
    }

    clone(): Layer {
        const layer: Layer = new Layer(this.name);
        const id = this.getId();

        if(id !== null)
            layer.setId(id);

        layer.setVisibility(this.visibility);
        layer.setImage(this.image);
        layer.setImageContent(this.content);
        layer.setImageSrc(this.imageSrc);
        layer.setAlpha(this.Alpha);
        return layer;
    }
}