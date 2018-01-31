import { BrushLoaderModule } from "./ui/loaders/BrushLoader";
import { ColorLoaderModule } from "./ui/loaders/ColorLoader";
import { DownloadBtn } from "./scripts/buttons";
import { MainBoard } from "./ui/Board";
import { LayerManagerModule } from "./managers/LayerManager";
import { Layer } from "./components/Layer";
import * as $ from 'jquery';
import { FiltersPanelModule } from "./ui/FiltersPanel";
import { LayerFilterPanel } from "./ui/components/Panel";
import { LayersPanelModule } from "./ui/LayersPanel";
import { RoundBrush, SquareBrush, ClearBrush, FadedRoundBrush, DottedRoundBrush, TriangleBrush, RandomJitterBrush } from "./components/Brush";
import { Color } from "./components/Color";
import { getRandomColor } from "./utils/Helper";

/** Loader Started */
const loaderHolder: JQuery<HTMLElement> = $("#loaderHolder");

/**********************Brushes*****************/
const brushElement: JQuery<HTMLElement> = $("#brushes");

/** Add Brushes */
BrushLoaderModule.addBrush(RoundBrush);
BrushLoaderModule.addBrush(SquareBrush);
BrushLoaderModule.addBrush(TriangleBrush);
BrushLoaderModule.addBrush(ClearBrush);
BrushLoaderModule.addBrush(FadedRoundBrush);
BrushLoaderModule.addBrush(DottedRoundBrush);
BrushLoaderModule.addBrush(RandomJitterBrush);

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
LayersPanelModule.initialize(LayerFilterPanel); 
FiltersPanelModule.initialize(LayerFilterPanel);

/**********************Layers**************************/
LayerManagerModule.add(new Layer("background"));


/** Loader Finished */
loaderHolder.remove();
