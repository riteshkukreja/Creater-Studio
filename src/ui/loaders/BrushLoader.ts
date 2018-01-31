import { Brush } from '../../components/Brush';
import * as $ from 'jquery';
import { Color } from '../../components/Color';
import { Position } from '../../components/Position';
import { ControlSwatch } from '../components/ControlSwatch';
import { StudioEventBus } from "../../components/EventBus";
import { ColorLoaderModule } from "./ColorLoader";

export class BrushLoader extends ControlSwatch {
    private brushes: Brush[] = [];
    private brushSize: number = 10;
    private brushIconSize: number = 50;

    private selectedBrush: Brush;

    private selectBrush(pos: number): void {
        if(pos >= 0 && pos < this.brushes.length) {
            this.selectedBrush = this.brushes[pos];
            this.selectedBrush.initialize();
            this.updateView();
        } else {
            throw "Not a valid brush index provided";
        }
    }

    private updateView() {
        this.updateDetails();
        this.toggleSwatchView(false);
    }

    private drawBrushGroup(title: string, list: Brush[]): JQuery<HTMLDivElement> {
        const brushGroup: JQuery<HTMLDivElement> = <JQuery<HTMLDivElement>> $("<div/>", {
            class: 'swatch-group'
        });

        const titleSpan: JQuery<HTMLSpanElement> = <JQuery<HTMLSpanElement>> $("<span/>", {
            class: 'group-title',
            text: title
        });

        const brushPalete: JQuery<HTMLDivElement> = <JQuery<HTMLDivElement>> $("<div/>", {
            class: 'swatch-body'
        });

        const brushCanvas: JQuery<HTMLCanvasElement> = <JQuery<HTMLCanvasElement>> $("<canvas/>");
        const brushContext: CanvasRenderingContext2D|null = brushCanvas.get(0).getContext('2d');

        brushCanvas.get(0).width = this.brushIconSize;
        brushCanvas.get(0).height = this.brushIconSize;

        for(var i in list) {
            if(brushContext !== null) {
                brushContext.clearRect(0, 0, this.brushIconSize, this.brushIconSize);
                list[i].draw(new Position(this.brushIconSize/2, this.brushIconSize/2), this.brushIconSize/2, new Color(0, 0, 0, 1), brushContext);

                const brushImageSource = brushCanvas.get(0).toDataURL('image/png');
                const brushImageElement: JQuery<HTMLImageElement> = <JQuery<HTMLImageElement>> $("<img/>", {
                    src: brushImageSource,
                    class: 'brush',
                    title: list[i].getLabel(),
                    width: this.brushIconSize,
                    height: this.brushIconSize
                });

                brushImageElement.data('_id', i);

                brushImageElement.on("click", (ev: JQuery.Event) => {
                    const pos: number = <number> $(ev.target).data('_id');
                    this.selectBrush(pos);
                });

                brushPalete.append(brushImageElement);
            } else {
                throw "Failed to initialize brushes";
            }
        }

        brushGroup.append(titleSpan);
        brushGroup.append(brushPalete);

        return brushGroup;
    } 

    private drawBrushSizeGroup(title: string): JQuery<HTMLDivElement> {
        const brushGroup: JQuery<HTMLDivElement> = <JQuery<HTMLDivElement>> $("<div/>");
        brushGroup.addClass("swatch-group");

        const titleSpan: JQuery<HTMLSpanElement> = <JQuery<HTMLSpanElement>> $("<span/>");
        titleSpan.addClass("group-title");
        titleSpan.text(title);

        /** Brush Size content */
        const brushPalete: JQuery<HTMLDivElement> = <JQuery<HTMLDivElement>> $("<div/>");

        /** Brush minimum size icon */
        const sizeSliderMinInfo: JQuery<HTMLSpanElement> = <JQuery<HTMLSpanElement>> $("<span/>");
        sizeSliderMinInfo.addClass("slider-min");
        sizeSliderMinInfo.text(1);

        /** Brush Size slider */
        const sizeSlider: JQuery<HTMLInputElement> = <JQuery<HTMLInputElement>> $("<input/>", {
            type: 'range',
            min: 1,
            max: 100,
            step: 1,
            value: this.brushSize
        });

        sizeSlider.on("input", (e: JQuery.Event) => {
            this.brushSize = <number> parseInt($(e.target).val() + '' || '10');
        });

        /** Brush maximum size icon */
        const sizeSliderMaxInfo: JQuery<HTMLSpanElement> = <JQuery<HTMLSpanElement>> $("<span/>");
        sizeSliderMaxInfo.addClass("slider-max");
        sizeSliderMaxInfo.text(100);
        
        brushPalete.append(sizeSliderMinInfo);
        brushPalete.append(sizeSlider);
        brushPalete.append(sizeSliderMaxInfo);

        brushGroup.append(titleSpan);
        brushGroup.append(brushPalete);

        return brushGroup;
    }    
    
    protected drawSwatchItems(): JQuery<HTMLDivElement> {
        const brushPalete: JQuery<HTMLDivElement> = <JQuery<HTMLDivElement>> $("<div/>");

        brushPalete.append(this.drawBrushSizeGroup("Brush Size"));
        brushPalete.append(this.drawBrushGroup("Brushes", this.brushes));

        return brushPalete;
    }
    
    protected drawDetailItem(): JQuery<HTMLSpanElement> {
        /** Selected Brush details */
        const selectedBrushDetail: JQuery<HTMLSpanElement> = <JQuery<HTMLSpanElement>> $("<span/>", {
            class: 'bordered',
            text: (this.selectedBrush ? this.selectedBrush.getLabel() : "select brush")
        });

        return selectedBrushDetail;
    }
    
    private drawBrush(position: Position, color: Color, context: CanvasRenderingContext2D): void {
        this.selectedBrush.draw(position, this.brushSize, color, context);
    }

    bootstrap(parent: JQuery<HTMLElement>): void {
        this.selectedBrush = this.brushes[0];
        this.draw(parent);

        StudioEventBus.subscribe("draw-point", (event: JQuery.Event, data: any) => {
            this.drawBrush(data.position, ColorLoaderModule.getSelected(), data.context);
            StudioEventBus.publish("draw-point-success", data.position);
        });

        StudioEventBus.subscribe("draw-point-end", (event: JQuery.Event, data: any) => {
            this.selectedBrush.initialize();
        });
    }

    getSelected(): Brush {
        return this.selectedBrush;
    }

    addBrush(brush: Brush): void {
        this.brushes.push(brush);
        
        /** If visible */
        if(this.isVisible())
            this.updateSwatches();
    }
}

export const BrushLoaderModule: BrushLoader = new BrushLoader();