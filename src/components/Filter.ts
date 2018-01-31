import * as $ from 'jquery';

export class Filter {
    private content: string|null = null;
    private name: string;
    private id: string|null = null;
    
    constructor(name: string) {
        this.name = name;
    }

    apply(context: CanvasRenderingContext2D): void {
        if(this.content != null) {
            let img: JQuery<HTMLImageElement> = <JQuery<HTMLImageElement>> $("<img/>", { src: this.content });

            img.on('load', () => {
                context.drawImage(img.get(0), 0, 0);
            });
        }
    }

    rename(n: string): void {
        this.name = n;
    }

    getName(): string {
        return this.name;
    }

    getContent(): string|null {
        return this.content;
    }

    updateContent(con: string): void {
        this.content = con;
    }

    getId(): string|null {
        return this.id;
    }

    setId(id: string) {
        this.id = id;
    }
}