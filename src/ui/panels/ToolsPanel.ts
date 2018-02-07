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
    private toolsDom: Map<string, JQuery<HTMLElement>> = new Map<string, JQuery<HTMLElement>>();
    private toolHolder: JQuery<HTMLElement>;
    private selectedTool: JQuery<HTMLElement>|null = null;
    
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
                if(!firstDomTool.done) {
                    if(this.selectedTool !== null)
                        this.selectedTool.removeClass('selected');

                    this.selectedTool = firstDomTool.value;
                    this.selectedTool.addClass('selected');
                } else { 
                    if(this.selectedTool !== null)
                        this.selectedTool.removeClass('selected');

                    this.selectedTool = null;
                }
            } else {
                const _id = tool.getId();
                if(_id === null) {
                    throw new InvalidArgException("Invalid tool selected");
                }

                const Dtool = this.toolsDom.get(_id);
                if(Dtool !== undefined) {
                    if(this.selectedTool !== null)
                        this.selectedTool.removeClass('selected');
                    
                    this.selectedTool = Dtool;
                    this.selectedTool.addClass('selected');
                } else
                    throw new InvalidArgException(`Tool with id ${_id} doesn't exists in DOM`);
            }
        });
    }

    private addTool(tool: Tool): void {
        const _id = tool.getId();
        if(_id == null)
            throw new InvalidArgException("Tool has invalid id of null");

        const Dtool: JQuery<HTMLElement> = $("<section/>", { 'data-id': _id, class: 'tool' });

        Dtool.click(e => {
            ToolManager.singleton().setSelected(_id);
        });

        Dtool.append(tool.getDom());

        this.toolHolder.append(Dtool);
        this.toolsDom.set(_id, Dtool);
        
        ToolManager.singleton().setSelected(_id);
    }

    private updateTool(tool: Tool): void {
        const _id = tool.getId();
        if(_id == null || this.toolsDom.get(_id) == null)
            throw new InvalidArgException("Tool has invalid id of null");

        const Dtool: JQuery<HTMLElement>|undefined = this.toolsDom.get(_id);
        if(Dtool == undefined)
            throw new InvalidArgException(`Tool with id ${_id} doesn't exists in DOM`);

        Dtool.empty();
        Dtool.append(tool.getDom());
    }

    private removeTool(tool: Tool): void {
        const _id = tool.getId();
        if(_id == null || this.toolsDom.get(_id) == null)
            throw new InvalidArgException("Tool has invalid id of null");

        const Dtool: JQuery<HTMLElement>|undefined = this.toolsDom.get(_id);
        if(Dtool == undefined)
            throw new InvalidArgException(`Tool with id ${_id} doesn't exists in DOM`);

        Dtool.empty();
        ToolManager.singleton().setSelected(null);
    }
}

export enum ToolsPanelEvents {
}

export const ToolsPanelModule: ToolsPanel = new ToolsPanel();