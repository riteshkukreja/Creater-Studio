import * as $ from 'jquery';

export class Layer {
    private name: string;

    private content: ImageData;
    private imageSrc: string;
    private visibility: boolean = true;
    private alpha: number  = 1;
    private id: number|null = null;
    private image: HTMLImageElement;
    
    constructor(title: string) {
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

    setId(id: number): void {
        this.id = id;
    }

    getId(): number|null {
        return this.id;
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
}