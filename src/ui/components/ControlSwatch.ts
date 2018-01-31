import * as $ from 'jquery';

export abstract class ControlSwatch {
    private holder: JQuery<HTMLDivElement>;
    private swatchHolder: JQuery<HTMLDivElement>;
    private detailsHolder: JQuery<HTMLDivElement>;

    protected abstract drawDetailItem(): JQuery<HTMLElement>;
    protected abstract drawSwatchItems(): JQuery<HTMLElement>;
    
    toggleSwatchView(show?: boolean): void {
        if(typeof show == "undefined") {
            if(this.swatchHolder.hasClass("hide"))
                this.swatchHolder.removeClass("hide");
            else
                this.swatchHolder.addClass("hide");
        } else if(show) {
            this.swatchHolder.removeClass("hide");
        } else {
            this.swatchHolder.addClass("hide");
        }
    }

    updateDetails(): void {
        this.detailsHolder.empty();

        /** Selected Brush details */
        const selectedDetail = this.drawDetailItem();
        this.detailsHolder.append(selectedDetail);
    }

    updateSwatches(): void {
        this.swatchHolder.empty();

        /** Selected Brush details */
        const selectedDetail: JQuery<HTMLElement> = this.drawSwatchItems();
        this.swatchHolder.append(selectedDetail);
    }

    detailView(): void {
        this.detailsHolder = <JQuery<HTMLDivElement>> $("<div/>", {
            class: 'cover'
        });
       
        const self: any = this;
        this.detailsHolder.on("click", (e) => {
            self.toggleSwatchView();
        });

        this.updateDetails();
    }

    swatchView(): void {
        this.swatchHolder = <JQuery<HTMLDivElement>> $("<div/>", {
            class: 'swatches hide'
        });

        const swatchItem: JQuery<HTMLElement> = this.drawSwatchItems();
        this.swatchHolder.append(swatchItem);
    }

    draw(parent: JQuery<HTMLElement>): void {
        this.holder = <JQuery<HTMLDivElement>> $("<div/>", {
            class: 'swatch-container'
        });

        this.detailView();
        this.swatchView();

        /** Show selected brush and dropdown option */
        this.holder.append(this.detailsHolder);

        /** Show all brushes */
        this.holder.append(this.swatchHolder);

        parent.append(this.holder);
    }

    isVisible(): boolean {
        return this.swatchHolder !== undefined && this.detailsHolder !== undefined;
    }
}