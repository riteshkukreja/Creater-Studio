import { Panel } from "../components/Panel";
import { EventBus, StudioEventBus } from "../../components/EventBus";
import { EventBusManager } from "../../managers/EventBusManager";
import { IBusType } from "../../interfaces/IBusType";
import { Tool } from "../../components/Tool";
import { InvalidArgException } from "../../exceptions/InvalidArgException";
import { ToolManagerEvents, ToolManager } from "../../managers/ToolManager";
import * as $ from 'jquery';
import "jquery-ui-bundle";
import { IUISubPanel } from "../../exceptions/IUISubPanel";
import { ManagerEvents } from "../../managers/Manager";

export class ToolsPanel implements IUISubPanel {
    private panel: Panel;
    private toolsDom: Map<string, JQuery<HTMLDivElement>> = new Map<string, JQuery<HTMLDivElement>>();
    private toolHolder: JQuery<HTMLElement>;
    private selectedTool: JQuery<HTMLElement>|null;
    
    private eventBus: EventBus<Tool>;

    public initialize(panel: Panel): void {
        this.panel = panel;
        this.toolHolder = this.panel.addSubPanel("Tools");

        this.eventBus = StudioEventBus;

        this.eventBus.subscribe(IBusType.TOOL.toString() + ManagerEvents.ADD.toString(), (event: JQuery.Event, data: Tool) => {
            this.addTool(data);
        });

        this.eventBus.subscribe(IBusType.TOOL.toString() + ManagerEvents.UPDATE.toString(), (event: JQuery.Event, data: Tool) => {
            this.updateTool(data);
        });
        
        this.eventBus.subscribe(IBusType.TOOL.toString() + ManagerEvents.REMOVE.toString(), (event: JQuery.Event, data: Tool) => {
            this.removeTool(data);
        });

        /** my events */
        StudioEventBus.subscribe(ToolManagerEvents.TOOL_SELECTED, (event: JQuery.Event, tool: Tool) => {
            if(tool === null) {
                /** select the first tool */
                const firstDomTool = this.toolsDom.values().next();
                if(!firstDomTool.done) this.selectedTool = firstDomTool.value;
                else this.selectedTool = null;
            } else {
                const _id = tool.getId();
                if(_id === null) {
                    throw new InvalidArgException("Invalid tool selected");
                }

                const Dtool = this.toolsDom.get(_id);
                if(Dtool !== undefined)
                    this.selectedTool = Dtool;
                else
                    throw new InvalidArgException(`Tool with id ${_id} doesn't exists in DOM`);
            }
        });
    }

    private addTool(tool: Tool): void {
        const _id = tool.getId();
        if(_id == null)
            throw new InvalidArgException("Tool has invalid id of null");

        const Dtool: JQuery<HTMLDivElement> = <JQuery<HTMLDivElement>> $("<div/>", { 'data-id': _id, class: 'tool' });
        const DToolTitle: JQuery<HTMLSpanElement> = <JQuery<HTMLSpanElement>> $("<span/>", { text: tool.getLabel() });

        Dtool.click(e => {
            ToolManager.singleton().setSelected(_id);
        });

        Dtool.append(DToolTitle);

        this.toolHolder.append(Dtool);
        this.toolsDom.set(_id, Dtool);
        
        ToolManager.singleton().setSelected(_id);
    }

    private updateTool(tool: Tool): void {
        const _id = tool.getId();
        if(_id == null || this.toolsDom.get(_id) == null)
            throw new InvalidArgException("Tool has invalid id of null");

        const Dtool: JQuery<HTMLDivElement>|undefined = this.toolsDom.get(_id);
        if(Dtool == undefined)
            throw new InvalidArgException(`Tool with id ${_id} doesn't exists in DOM`);

        const DToolTitle: JQuery<HTMLSpanElement> = <JQuery<HTMLSpanElement>> $("<span/>", { text: tool.getLabel() });

        Dtool.empty();
        Dtool.append(DToolTitle);
    }

    private removeTool(tool: Tool): void {
        const _id = tool.getId();
        if(_id == null || this.toolsDom.get(_id) == null)
            throw new InvalidArgException("Tool has invalid id of null");

        const Dtool: JQuery<HTMLDivElement>|undefined = this.toolsDom.get(_id);
        if(Dtool == undefined)
            throw new InvalidArgException(`Tool with id ${_id} doesn't exists in DOM`);

        Dtool.empty();
        ToolManager.singleton().setSelected(null);
    }
}

export enum ToolsPanelEvents {
}

export const ToolsPanelModule: ToolsPanel = new ToolsPanel();