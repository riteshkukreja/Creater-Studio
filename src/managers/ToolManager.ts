import { Manager } from "./Manager";
import { Tool } from "../components/Tool";
import { IBusType } from "../interfaces/IBusType";
import { EventBusManager } from "./EventBusManager";
import { Color } from "../components/Color";
import { Position } from "../components/Position";
import { ToolsPanelEvents } from "../ui/panels/ToolsPanel";
import { StudioEventBus } from "../components/EventBus";

export class ToolManager extends Manager<Tool> {
    private static self: ToolManager|null = null;
    private selectedTool: Tool|null = null;

    bootstrap() {
        super.bootstrap(IBusType.TOOL);

        /** my events */
        StudioEventBus.subscribe(ToolManagerEvents.EXECUTE_TOOL.toString(), (event: JQuery.Event, {position, size, color, context, width, height}) => {
            this.executeTool(position, size, color, context, width, height);
        });
    }

    public static singleton(): ToolManager {
        if(this.self == null) {
            this.self = new ToolManager();
            this.self.bootstrap();
        }

        return this.self;
    }

    private executeTool(position: Position, size: number, color: Color, context: CanvasRenderingContext2D, width: number, height: number): void {
        if(this.selectedTool !== null) {
            this.selectedTool.draw(position, size, color, context, width, height);
        }
    }

    public setSelected(id: string|null) {
        try {
            this.selectedTool = id == null ? null : this.get(id);
            StudioEventBus.publish(ToolManagerEvents.TOOL_SELECTED, this.selectedTool);
        } catch(e) {
            throw e;
        }
    }

    public getSelected(): Tool|null {
        return this.selectedTool;
    }
}

export enum ToolManagerEvents {
    EXECUTE_TOOL = "toolmanager:execute-tool",
    TOOL_SELECTED = "toolmanager:tool-selected"
}