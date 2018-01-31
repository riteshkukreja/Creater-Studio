import { Swatch } from "../ui/components/Swatch";
import { MainBoard } from "../ui/Board";
import * as $ from 'jquery';

export const DownloadBtn = new Swatch(() => {
    const btn: JQuery<HTMLElement> = $("<a/>", {
        class: 'btn downloadbtn'
    });

    btn.click((ev: JQuery.Event) => {
        const dt = MainBoard.getImage();
        const src = dt.replace(/^data:image\/png/, 'data:application/octet-stream');

        const hiddenBtn: JQuery<HTMLAnchorElement> = <JQuery<HTMLAnchorElement>> $("<a/>");
        hiddenBtn.attr("download", "image.png");
        hiddenBtn.attr("target", "_blank");
        hiddenBtn.attr("href", src);
        hiddenBtn.trigger('click');

        hiddenBtn.click(() => {
            console.log("clicked");
        });
    });

    return btn;
});