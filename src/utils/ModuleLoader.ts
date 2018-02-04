import { BrushLoaderModule } from "../ui/loaders/BrushLoader";
import { ColorLoaderModule } from "../ui/loaders/ColorLoader";
import { MainBoard } from "../ui/Board";
import { Layer } from "../components/Layer";
import { LayerManager } from "../managers/LayerManager";
import { DownloadBtn } from "../scripts/buttons";
import * as $ from 'jquery';

export const ModuleLoader = (function() {
    const Modules = [
        /** Jquery */
        "https://code.jquery.com/jquery-3.2.1.min",
        "https://code.jquery.com/ui/1.12.1/jquery-ui",

        /** Bootstrap */
        "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min",

        /** Utils */
        "utils/EventBus",
        "utils/Brush",
        "utils/Color",
        "utils/Layer",
        "utils/Position",
        "utils/Filter",
    
        /** Managers */
        "managers/FilterManager",
        "managers/LayerManager",
    
        /** UI */
        "ui/Board",
        "ui/Panel",
        "ui/Swatch",
        "ui/ControlSwatch",
        "ui/BrushLoader",
        "ui/ColorLoader",
        "ui/LayersPanel",
        "ui/FiltersPanel",
    
        /** Custom */
        "scripts/brushes",
        "scripts/colors",
        "scripts/buttons"
    ];
    
    const totalScripts = Modules.length;

    let loadModules = function(): void  {
        loadscripts(Modules, onInitialized);
    }
    
    let loadscripts = function(scripts: string[], complete: () => void) {
        if(scripts.length == 0) {
            complete();
            return;
        }

        let loadScript = (src: string) => {
            return new Promise((resolve, reject) => {
                let scriptTag = document.createElement("script");
                scriptTag.setAttribute("src", src + ".js");
                scriptTag.addEventListener("load", (e) => {
                    console.log("Loaded ", src);
                    resolve();
                });

                document.head.appendChild(scriptTag);  
            }); 
        }

        loadScript(scripts[0])
            .then(() => {
                scripts.splice(0, 1);
                loadscripts(scripts, complete);
            });
    }
    
    let onInitialized = function(): void {
        /**********************Brushes*****************/
        const brushElement: JQuery<HTMLElement> = $("#brushes");
        BrushLoaderModule.bootstrap(brushElement);
    
        /**********************COLORS*****************/
        const colorElement: JQuery<HTMLElement> = $("#colors");
        ColorLoaderModule.bootstrap(colorElement);
    
        /**********************SAVING IMAGE *******************/
        const btnElement: JQuery<HTMLElement> = $("#btns");
        DownloadBtn.draw(btnElement);
    
        /**********************Drawing****************/
        const canvasHolder: JQuery<HTMLElement> = $("#canvas_holder");
        MainBoard.bootstrap(canvasHolder);
        MainBoard.resize(window.innerWidth, window.innerHeight - 50);
    
        /**********************Layers**************************/
        LayerManager.singleton().add(new Layer("background"));
    }
    
    let showProgress = function(): number {
        return Math.floor(((totalScripts - Modules.length) / totalScripts) * 100 );
    }

    return {
        showProgress: showProgress,
        start: loadModules,
        completed: () => (showProgress() == 100)
    };
})();