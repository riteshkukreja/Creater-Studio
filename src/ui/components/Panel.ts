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
    private subPanels: Map<string, JQuery<HTMLElement>> = new Map<string, JQuery<HTMLElement>>();

    constructor(title) {
        this.gid = title;
    }

    initiaize(parent: JQuery<HTMLElement>): void {
        this.holder = $("<div/>", { class: 'panel', id: this.gid, style: 'position: absolute' });
        this.navHolder = $("<div/>", { class: 'nav nav-pills' });
        this.contentHolder = $("<div/>", { class: 'tab-content clearfix' });
        
        let draggingHandle: JQuery<HTMLElement> = $("<div/>", { class: 'panel-handle' });

        this.holder.append(draggingHandle);
        this.holder.append(this.navHolder);
        this.holder.append(this.contentHolder);

        this.holder.draggable({ scroll: false, handle: '.panel-handle', containment: this.boardId });
        parent.append(this.holder);
    }

    private updateActivatedContent(title: string, activate?: boolean): void {
        /** active content html */
        const cHTML: JQuery<HTMLElement>|undefined = this.subPanels.get(title);
        if(cHTML !== undefined) {

            if(activate !== undefined && !activate)
                cHTML.removeClass('active');
            else
                cHTML.addClass("active");
        }
    }

    addSubPanel(title: string): JQuery<HTMLElement> {
        let tabHTML: JQuery<HTMLElement> = $("<li/>", { 'data-title': title });
        let contentHTML: JQuery<HTMLElement> = $("<div/>", { class: 'tab-pane', id: `${this.gid}_${title}` });

        let tabA: JQuery<HTMLElement> = $("<a/>", { 'data-toggle': 'tab', text: title });
        tabA.appendTo(tabHTML);

        this.navHolder.append(tabHTML);
        this.contentHolder.append(contentHTML);

        tabA.click(e => {
            if(this.selectedTab) {
                this.selectedTab.removeClass("active");
                const title: string = this.selectedTab.data('title');
                this.updateActivatedContent(title, false);
            }
            this.selectedTab = tabHTML;
            this.selectedTab.addClass("active");

            /** active content html */
            this.updateActivatedContent(title, true);
        });

        if(this.subPanels.size == 1) {
            this.navHolder.children().first().children().first().click();
        }

        this.subPanels.set(title, contentHTML);

        return contentHTML;
    }

    getSubPanel(title: string): JQuery<HTMLElement> {
        return $(`#${this.gid}_${title}`);
    }

    resize(width?: number, height?: number): void {
        if(width !== undefined)
            this.holder.css('width', width + 'px');
        
        if(height !== undefined)
            this.holder.css('height', height + 'px');
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
LayerFilteWindow.moveTo(window.innerWidth - 300, 100);

export const ToolsWindow = new Panel("tools");
ToolsWindow.initiaize($("#panels"));
ToolsWindow.resize(undefined, undefined);
ToolsWindow.moveTo(0, 100);