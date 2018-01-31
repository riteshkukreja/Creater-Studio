import { Color } from "../../components/Color";
import { Position } from "../../components/Position";
import { ControlSwatch } from "../components/ControlSwatch";

import * as $ from 'jquery';

export class ColorLoader extends ControlSwatch {
    private colors: Color[] = [];
    private history: Color[] = [];

    private selectedColor: Color;

    private setColor(color: Color): void {
        const nextColor: Color = color.clone();
        nextColor.Alpha = this.selectedColor.Alpha;
        this.selectedColor = nextColor;
    }

    private insertIntoHistory(color: Color): void {
        for(let i = this.history.length-1; i >= 0; i--) {
            if(this.history[i] == color) {
                this.history.splice(i, 1);
            }
        }

        this.history.unshift(color);
    }

    private drawColorItem(pos: number, color: Color): JQuery<HTMLElement> {
        const swatch: JQuery<HTMLSpanElement> = $('<span/>', {
            class: 'color'
        });

        swatch.css("background-color", color.toString());
        swatch.data("pos", pos.toLocaleString());
        swatch.data("type", "all");
        swatch.on("click", this.setSwatch());

        return swatch;
    }

    private drawHistoryItem(pos: number, color: Color): JQuery<HTMLElement> {
        const swatch: JQuery<HTMLSpanElement> = $('<span/>', { class: 'color' });

        swatch.css("background-color", color.toString());
        swatch.data("pos", pos.toLocaleString());
        swatch.data("type", "history");
        swatch.on("click", this.setSwatch());

        return swatch;
    }

    private drawColorGroup(): JQuery<HTMLElement> {
        const colorGroup: JQuery<HTMLDivElement> = <JQuery<HTMLDivElement>> $("<div/>", { class: 'color-group' });

        const titleSpan: JQuery<HTMLSpanElement> = <JQuery<HTMLSpanElement>> $("<span/>", {
            class: 'group-title',
            text: 'All'
        });

        const colorPalete: JQuery<HTMLDivElement> = <JQuery<HTMLDivElement>> $("<div/>");
        for(let i = 0, n = this.colors.length; i < n ; i++) {
            colorPalete.append(this.drawColorItem(i, this.colors[i]));
        }

        colorGroup.append(titleSpan);
        colorGroup.append(colorPalete);

        return colorGroup;
    }
    
    private drawHistoryGroup(): JQuery<HTMLElement> {
        const colorGroup: JQuery<HTMLDivElement> = <JQuery<HTMLDivElement>> $("<div/>", { class: 'color-group' });

        const titleSpan: JQuery<HTMLSpanElement> = <JQuery<HTMLSpanElement>> $("<span/>", {
            class: 'group-title',
            text: 'Frequently Used'
        });

        const colorPalete: JQuery<HTMLDivElement> = <JQuery<HTMLDivElement>> $("<div/>");
        for(let i = 0, n = this.history.length; i < n ; i++) {
            colorPalete.append(this.drawHistoryItem(i, this.history[i]));
        }

        colorGroup.append(titleSpan);
        colorGroup.append(colorPalete);

        return colorGroup;
    }

    private drawAlphaGroup(title: string): JQuery<HTMLElement> {
        const brushGroup: JQuery<HTMLDivElement> = <JQuery<HTMLDivElement>> $("<div/>", { class: 'swatch-group' });

        const titleSpan: JQuery<HTMLSpanElement> = <JQuery<HTMLSpanElement>> $("<span/>", {
            class: 'group-title',
            text: title
        });

        /** Brush Size content */
        const brushPalete: JQuery<HTMLDivElement> = <JQuery<HTMLDivElement>> $("<div/>");

        /** Brush minimum size icon */
        const sizeSliderMinInfo: JQuery<HTMLSpanElement> = <JQuery<HTMLSpanElement>> $("<span/>", {
            class: 'slider-min',
            text: '1'
        });

        /** Brush Size slider */
        const sizeSlider: JQuery<HTMLInputElement> = <JQuery<HTMLInputElement>> $("<input/>", {
            type: 'range',
            min: 0.01,
            max: 1,
            step: 0.01,
            value: (this.selectedColor) ? this.selectedColor.Alpha : 1
        });

        sizeSlider.on("input", (e) => {
            this.selectedColor.Alpha = parseFloat(<string> sizeSlider.val() || '1');
            console.log(this.selectedColor.Alpha);
        });

        /** Brush maximum size icon */
        const sizeSliderMaxInfo: JQuery<HTMLSpanElement> = <JQuery<HTMLSpanElement>> $("<span/>", {
            class: 'slider-max',
            text: '100'
        });
        
        brushPalete.append(sizeSliderMinInfo);
        brushPalete.append(sizeSlider);
        brushPalete.append(sizeSliderMaxInfo);

        brushGroup.append(titleSpan);
        brushGroup.append(brushPalete);

        return brushGroup;
    } 
    
    private setSwatch(): (e: JQuery.Event) => void {
        const self: ColorLoader = this;
        return (e: JQuery.Event) => {
            const swatch: JQuery<HTMLElement> = <JQuery<HTMLElement>> $(e.target);

            if(swatch) {
                const pos: number = swatch.data("pos");
                const type: string = swatch.data("type");

                if(type === "history") {
                    self.setColor(self.history[pos]);
                    self.insertIntoHistory(self.history[pos]);
                } else {
                    self.setColor(self.colors[pos]);
                    self.insertIntoHistory(self.colors[pos]);
                }
                
                self.updateDetails();
                self.updateSwatches();
                self.toggleSwatchView(false);
            }
        }
    }

    protected drawSwatchItems(): JQuery<HTMLElement> {
        const colorPalete: JQuery<HTMLDivElement> = <JQuery<HTMLDivElement>> $("<div/>");
        const alphaGroup: JQuery<HTMLElement> = this.drawAlphaGroup("Opacity");

        colorPalete.append(alphaGroup);

        if(this.history.length > 0) {
            const frequentlyUsedColorGroup: JQuery<HTMLElement> = this.drawHistoryGroup();
            colorPalete.append(frequentlyUsedColorGroup);
        }
        
        const allColorGroup: JQuery<HTMLElement> = this.drawColorGroup();
        colorPalete.append(allColorGroup);

        return colorPalete;
    }

    protected drawDetailItem(): JQuery<HTMLElement> {
        const selectedDetail: JQuery<HTMLElement> = $("<i/>", {
            class: 'color active small'
        });

        if(this.selectedColor !== undefined)
            selectedDetail.css('background-color', this.selectedColor.toString());
        else
            selectedDetail.css('background-color', "#000");

        return selectedDetail;
    }

    bootstrap(parent: JQuery<HTMLElement>): void {
        this.selectedColor = this.colors[0] || new Color(0, 0, 0, 100);
        this.draw(parent);
    }

    getSelected(): Color {
        return this.selectedColor;
    }

    addColor(color: Color): void {
        this.colors.push(color);
        
        /** If visible */
        if(this.isVisible())
            this.updateSwatches();
    } 
}

export const ColorLoaderModule: ColorLoader = new ColorLoader();