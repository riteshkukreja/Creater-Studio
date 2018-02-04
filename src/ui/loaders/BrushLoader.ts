import { Brush } from '../../components/Brush';
import * as $ from 'jquery';
import { Color } from '../../components/Color';
import { Position } from '../../components/Position';
import { ControlSwatch } from '../components/ControlSwatch';
import { StudioEventBus } from "../../components/EventBus";
import { ColorLoaderModule } from "./ColorLoader";
import { BrushManager, BrushManagerEvents } from '../../managers/BrushManager';
import { IBusType } from '../../interfaces/IBusType';
import { ManagerEvents } from '../../managers/Manager';

export class BrushLoader extends ControlSwatch {
    private brushIconSize: number = 50;

    private updateView() {
        this.updateDetails();
        this.toggleSwatchView(false);
    }

    private drawBrushGroup(title: string): JQuery<HTMLDivElement> {
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

        BrushManager.singleton().getAllBrushes((brush: Brush, i: string) => {
            if(brushContext !== null) {
                brushContext.clearRect(0, 0, this.brushIconSize, this.brushIconSize);
                brush.draw(null, new Position(this.brushIconSize/2, this.brushIconSize/2), this.brushIconSize/2, new Color(0, 0, 0, 1), brushContext);

                const brushImageSource = brushCanvas.get(0).toDataURL('image/png');
                const brushImageElement: JQuery<HTMLImageElement> = <JQuery<HTMLImageElement>> $("<img/>", {
                    src: brushImageSource,
                    class: 'brush',
                    title: brush.getLabel(),
                    width: this.brushIconSize,
                    height: this.brushIconSize
                });

                brushImageElement.data('_id', i);

                brushImageElement.on("click", (ev: JQuery.Event) => {
                    const pos: string = <string> $(ev.target).data('_id');
                    BrushManager.singleton().setSelected(pos);
                });

                brushPalete.append(brushImageElement);
            } else {
                throw "Failed to initialize brushes";
            }
        });

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
            value: BrushManager.singleton().getSize()
        });

        sizeSlider.on("input", (e: JQuery.Event) => {
            const brushSize = <number> parseInt($(e.target).val() + '' || '10');
            BrushManager.singleton().setSize(brushSize);
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
        brushPalete.append(this.drawBrushGroup("Brushes"));

        return brushPalete;
    }
    
    protected drawDetailItem(): JQuery<HTMLSpanElement> {
        /** Selected Brush details */
        const selectedBrush = BrushManager.singleton().getSelected();
        const selectedBrushDetail: JQuery<HTMLSpanElement> = <JQuery<HTMLSpanElement>> $("<span/>", {
            class: 'bordered',
            text: (selectedBrush !== null ? selectedBrush.getLabel() : "select brush")
        });

        return selectedBrushDetail;
    }
    
    bootstrap(parent: JQuery<HTMLElement>): void {
        this.draw(parent);

        StudioEventBus.subscribe(IBusType.BRUSH.toString() + ManagerEvents.ADD.toString(), (event: JQuery.Event, data: Brush) => {
            this.updateSwatches();
        });

        StudioEventBus.subscribe(IBusType.BRUSH.toString() + ManagerEvents.UPDATE.toString(), (event: JQuery.Event, data: Brush) => {
            this.updateSwatches();
        });

        StudioEventBus.subscribe(IBusType.BRUSH.toString() + ManagerEvents.REMOVE.toString(), (event: JQuery.Event, data: Brush) => {
            this.updateSwatches();
        });

        StudioEventBus.subscribe(BrushManagerEvents.BRUSH_SELECTED, (event: JQuery.Event, data: Brush) => {
            this.updateView();
        });
    }
}

export const BrushLoaderModule: BrushLoader = new BrushLoader();