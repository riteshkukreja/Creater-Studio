import { BrushLoaderModule } from "./ui/loaders/BrushLoader";
import { ColorLoaderModule } from "./ui/loaders/ColorLoader";
import { DownloadBtn } from "./scripts/buttons";
import { MainBoard } from "./ui/Board";
import { LayerManager } from "./managers/LayerManager";
import { Layer } from "./components/Layer";
import * as $ from 'jquery';
import { FiltersPanelModule } from "./ui/FiltersPanel";
import { LayerFilteWindow, ToolsWindow } from "./ui/components/Panel";
import { LayersPanelModule } from "./ui/LayersPanel";
import { RoundBrush, SquareBrush, ClearBrush, FadedRoundBrush, DottedRoundBrush, TriangleBrush, RandomJitterBrush } from "./components/Brush";
import { Color } from "./components/Color";
import { getRandomColor } from "./utils/Helper";
import { ToolsPanel, ToolsPanelModule } from "./ui/panels/ToolsPanel";
import { ToolManager } from "./managers/ToolManager";
import { PaintTool } from "./components/PaintTool";
import { EventBusManager } from "./managers/EventBusManager";
import { StudioEventBus, LayerEventBus, ToolEventBus, FilterEventBus } from "./components/EventBus";
import { BrushManager } from "./managers/BrushManager";

try {
    /** Loader Started */
    const loaderHolder: JQuery<HTMLElement> = $("#loaderHolder");

    /**********************EventBus*****************/
    EventBusManager.singleton().add(StudioEventBus);
    EventBusManager.singleton().add(LayerEventBus);
    EventBusManager.singleton().add(ToolEventBus);
    EventBusManager.singleton().add(FilterEventBus);

    /**********************Brushes*****************/
    const brushElement: JQuery<HTMLElement> = $("#brushes");
    BrushLoaderModule.bootstrap(brushElement);

    /**********************COLORS*****************/
    const colorElement: JQuery<HTMLElement> = $("#colors");

    /** Add Colors */
    const loadRandomColors = () => {
        const colorLimit: number = 50;
        for(let i = 0; i < colorLimit; i++) {
            ColorLoaderModule.addColor(getRandomColor());
        }
    }

    loadRandomColors();
    ColorLoaderModule.bootstrap(colorElement);

    /**********************SAVING IMAGE *******************/
    const btnElement: JQuery<HTMLElement> = $("#btns");
    DownloadBtn.draw(btnElement);

    /**********************Drawing****************/
    const canvasHolder: JQuery<HTMLElement> = $("#canvas_holder");
    MainBoard.bootstrap(canvasHolder);
    MainBoard.resize(window.innerWidth, window.innerHeight - 50);

    /** Panels */
    LayersPanelModule.initialize(LayerFilteWindow); 
    FiltersPanelModule.initialize(LayerFilteWindow);
    ToolsPanelModule.initialize(ToolsWindow);

    /**********************Layers**************************/
    LayerManager.singleton().add(new Layer("background"));

    /**********************TOOLS*****************/
    ToolManager.singleton().add(new PaintTool());
    
    /**********************BRUSHES*****************/
    BrushManager.singleton().add(RoundBrush);
    BrushManager.singleton().add(SquareBrush);
    BrushManager.singleton().add(TriangleBrush);
    BrushManager.singleton().add(ClearBrush);
    BrushManager.singleton().add(FadedRoundBrush);
    BrushManager.singleton().add(DottedRoundBrush);
    BrushManager.singleton().add(RandomJitterBrush);



    /** Loader Finished */
    loaderHolder.remove();
} catch(e) {
    console.error(e);
}