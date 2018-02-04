import $ = require("jquery");
import "jquery-ui-bundle";
//import 'jquery-ui/ui/widgets/draggable';


export class Panel{
    private gid: string;

    private holder: JQuery<HTMLElement>;
    private contentHolder: JQuery<HTMLElement>;
    private navHolder: JQuery<HTMLElement>;
    private selectedTab: JQuery<HTMLElement>;

    private boardId: string = "#currBoard";

    constructor(title) {
        this.gid = title;
    }

    initiaize(parent: JQuery<HTMLElement>): void {
        this.holder = $("<div/>", { class: 'panel', id: this.gid });
        this.navHolder = $("<div/>", { class: 'nav nav-pills' });
        this.contentHolder = $("<div/>", { class: 'tab-content clearfix' });
        
        let draggingHandle: JQuery<HTMLElement> = $("<div/>", { class: 'panel-handle' });

        this.holder.append(draggingHandle);
        this.holder.append(this.navHolder);
        this.holder.append(this.contentHolder);

        this.holder.draggable({ scroll: false, handle: '.panel-handle', containment: this.boardId });
        parent.append(this.holder);
    }

    addSubPanel(title: string): JQuery<HTMLElement> {
        let tabHTML: JQuery<HTMLElement> = $("<li/>");
        let contentHTML: JQuery<HTMLElement> = $("<div/>", { class: 'tab-pane', id: `${this.gid}_${title}` });

        let tabA: JQuery<HTMLElement> = $("<a/>", { href: `#${this.gid}_${title}`, 'data-toggle': 'tab', text: title });
        tabA.appendTo(tabHTML);

        this.navHolder.append(tabHTML);
        this.contentHolder.append(contentHTML);

        tabA.click(e => {
            if(this.selectedTab) {
                this.selectedTab.removeClass("active");
            }
            this.selectedTab = tabHTML;
            this.selectedTab.addClass("active");
        });

        if(this.navHolder.length == 1) {
            this.navHolder.children().first().children().first().click();
        }

        return contentHTML;
    }

    getSubPanel(title: string): JQuery<HTMLElement> {
        return $(`#${this.gid}_${title}`);
    }

    resize(width: number, height: number): void {
        this.holder.css({
            width: width + 'px',
            height: height + 'px'
        });
    }
    
    moveTo(x: number, y: number): void {
        let props: any = {}

        if(x < 0) {
            props['right'] = -x;
        } else {
            props['left'] = x;
        }

        if(y < 0) {
            props['bottom'] = -y;
        } else {
            props['top'] = y;
        }

        this.holder.css(props);
    }
}
 
export const LayerFilteWindow = new Panel("layer_filter");
LayerFilteWindow.initiaize($("#panels"));
LayerFilteWindow.resize(300, 500);
LayerFilteWindow.moveTo(window.innerWidth - 300, 50);

export const ToolsWindow = new Panel("tools");
ToolsWindow.initiaize($("#panels"));
ToolsWindow.resize(300, 500);
ToolsWindow.moveTo(0, 50);