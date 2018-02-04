import * as $ from 'jquery';
import { IEventMessageItem, EventMessageItem } from '../interfaces/EventMessageItem';
import { IClonableItem } from '../interfaces/IClonableItem';

export class Filter extends EventMessageItem implements IClonableItem<Filter> {
    private content: string|null = null;
    private name: string;
    
    constructor(name: string) {
        super();
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

    clone(): Filter {
        const filter = new Filter(this.name);
        
        const id = this.getId();
        if(id !== null)
            filter.setId(id);
        if(this.content !== null)
            filter.updateContent(this.content);

        return filter;
    }
}