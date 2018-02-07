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

    bootstrap(): void {
        super.bootstrap(IBusType.TOOL);

        /** my events */
        StudioEventBus.subscribe(ToolManagerEvents.EXECUTE_TOOL, (event: JQuery.Event, {position, color, context, width, height}) => {
            this.executeTool(position, color, context, width, height)
                .then(() => StudioEventBus.publish(ToolManagerEvents.EXECUTE_TOOL_SUCCESS, position))
                .catch((err) => console.error(err));
        });

        StudioEventBus.subscribe(ToolManagerEvents.TOOL_RESET, (event: JQuery.Event, data: any) => {
            if(this.selectedTool !== null)
                this.selectedTool.reset();
        });
    }

    public static singleton(): ToolManager {
        if(this.self == null) {
            this.self = new ToolManager();
            this.self.bootstrap();
        }

        return this.self;
    }

    private async executeTool(position: Position, color: Color, context: CanvasRenderingContext2D, width: number, height: number): Promise<void> {
        if(this.selectedTool !== null) {
            await this.selectedTool.draw(position, color, context, width, height);
        }
    }

    public setSelected(id: string|null): void {
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
    TOOL_RESET = "toolmanager:tool-reset",
    EXECUTE_TOOL_SUCCESS = "toolmanager:execute-tool-success",
    TOOL_SELECTED = "toolmanager:tool-selected"
}