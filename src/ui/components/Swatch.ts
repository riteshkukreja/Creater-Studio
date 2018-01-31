import * as $ from 'jquery';

export class Swatch {
    private detailsHolder: JQuery<HTMLElement>;

    private drawItem: () => JQuery<HTMLElement>;
    
    constructor(drawDetailItem: () => JQuery<HTMLElement>) {
        this.drawItem = drawDetailItem;
    }

    updateDetails(): void {
        this.detailsHolder.empty();

        /** Selected Brush details */
        const selectedDetail = this.drawItem();
        this.detailsHolder.append(selectedDetail);
    }

    detailView(): void {
        this.detailsHolder = $("<div/>");

        this.updateDetails();
    }

    draw(parent: JQuery<HTMLElement>): void {
        this.detailView();

        /** Show selected brush and dropdown option */
        parent.append(this.detailsHolder);
    }
}