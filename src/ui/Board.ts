import { StudioEventBus } from "../components/EventBus";
import { LayerManager, LayerManagerEvents } from "../managers/LayerManager";
import { Layer } from "../components/Layer";
import { Filter } from "../components/Filter";
import { Position } from "../components/Position";
import * as $ from 'jquery';
import { LayersPanelEvents } from "./panels/LayersPanel";
import { FilterPanelEvents } from "./panels/FiltersPanel";
import { BrushManagerEvents, BrushManager } from "../managers/BrushManager";

export class Board {
    private imageBoards = {};

    private prevBoardParent: JQuery<HTMLElement>;
    private nextBoardParent: JQuery<HTMLElement>;

    private mouseLocationViewer: JQuery<HTMLElement>;

    private currentBoard: JQuery<HTMLCanvasElement>;
    private currContext: CanvasRenderingContext2D | null;

    private backBoard: JQuery<HTMLCanvasElement>;
    private backContext: CanvasRenderingContext2D | null;

    private dragging: boolean = false;
    private selectedLayer: Layer | null = null;
    private width: number = 400;
    private height: number = 400;

    private initialize(): void {
        this.currentBoard = <JQuery<HTMLCanvasElement>>$("<canvas/>", { id: 'currBoard' });
        this.currContext = this.currentBoard.get(0).getContext('2d');

        this.backBoard = <JQuery<HTMLCanvasElement>>$("<canvas/>");
        this.backContext = this.backBoard.get(0).getContext('2d');

        this.handleMouseEvents();

        this.prevBoardParent = $("<div/>");
        this.nextBoardParent = $("<div/>");

        this.mouseLocationViewer = $("<span/>", { class: 'mouse-locator', text: 'X-Y' });
        $("body").append(this.mouseLocationViewer);
    }

    private updateAllCanvas(id: string): void {
        /** Clear all context */
        this.clearAllCanvas();

        /** If arbitrary layer is selected,, load it in current context */
        LayerManager.singleton().getAllLayers((layer: Layer, i: string) => {
            if (i < id) {
                // draw image in previous boards array
                const image = this.createImageBoard(i, layer.getImageSrc(), this.width, this.height, layer.Visibility, layer.Alpha);
                this.imageBoards[i] = image;
                this.prevBoardParent.append(image);
            } else if (i == id && layer.Visibility) {
                if (this.currContext !== null && this.backContext !== null) {
                    layer.apply(this.currContext);
                    layer.apply(this.backContext, true);
                    this.selectedLayer = layer;
                } else {
                    throw "Context loading failed";
                }
            } else {
                // draw image in next boards array
                const image = this.createImageBoard(i, layer.getImageSrc(), this.width, this.height, layer.Visibility, layer.Alpha);
                this.imageBoards[i] = image;
                this.nextBoardParent.append(image);
            }
        });
    }

    private createImageBoard(id: string, src: string, width: number, height: number, visible: boolean, opacity: number): JQuery<HTMLImageElement> {
        return <JQuery<HTMLImageElement>>$("<img/>", {
            src: src,
            'data-id': id,
            class: 'board-img ' + (visible ? '' : 'invisible'),
            width: width,
            height: height
        }).css({ opacity: opacity });
    }

    private putPoint(context: CanvasRenderingContext2D, e: JQuery.Event): void {
        if (e.clientX !== undefined && e.clientY !== undefined) {
            StudioEventBus.publish(BoardEvents.MOUSE_DOWN, new Position(e.clientX, e.clientY - 50));
            StudioEventBus.publish(BrushManagerEvents.DRAW_BRUSH, {
                position: new Position(e.clientX, e.clientY - 50),
                context: context
            });
        }
    }

    private dragOut(e: JQuery.Event): void {
        if (this.backContext !== null) {
            this.dragging = false;
            this.backContext.beginPath();
        }
    }

    private handleMouseEvents(): void {
        const self: Board = this;
        let dragging = false;
        
        this.currentBoard.on("mousedown", (e) => {
            if(self.backContext !== null && self.backContext !== undefined) {
                dragging = true;
                if(self.selectedLayer !== null && self.selectedLayer.Visibility)
                    self.putPoint(self.backContext, e);

                self.backContext.beginPath();
            }
        });

        this.currentBoard.on("mousemove", (e) => {
            if(self.backContext !== null && self.backContext !== undefined) {
                if(dragging && self.selectedLayer !== null && self.selectedLayer.Visibility) {
                    self.putPoint(self.backContext, e);
                }
            }

            /** show mouse current position */
            if (e.clientX !== undefined && e.clientY !== undefined) {
                this.mouseLocationViewer.text(e.clientX + "-" + e.clientY);
            }
        });

        this.currentBoard.on("mouseup", (e) => {
            dragging = false;
            if(self.backContext !== null && self.backContext !== undefined) {
                self.backContext.beginPath();
                if (e.clientX !== undefined && e.clientY !== undefined) {
                    StudioEventBus.publish(BrushManagerEvents.DRAW_BRUSH_END, {
                        position: new Position(e.clientX, e.clientY - 50),
                        context: self.backContext
                    });
                }
            }
        });
    }

    private clearAllCanvas(): void {
        if (this.currContext !== null && this.backContext !== null) {
            this.currContext.clearRect(0, 0,
                parseInt(this.currentBoard.attr('width') || this.width.toString()),
                parseInt(this.currentBoard.attr('height') || this.height.toString()));

            this.backContext.clearRect(0, 0,
                parseInt(this.backBoard.attr('width') || this.width.toString()),
                parseInt(this.backBoard.attr('height') || this.height.toString()));
        }

        this.prevBoardParent.children().remove();
        this.nextBoardParent.children().remove();
    }

    private getContext(): CanvasRenderingContext2D | null {
        return this.currContext;
    }

    private saveLayer(): void {
        
        if (this.selectedLayer !== null && this.currContext !== null && this.backContext !== null) {
            this.selectedLayer.update(this.backBoard[0], this.backContext,
                parseInt(this.backBoard.attr('width') || this.width.toString()),
                parseInt(this.backBoard.attr('height') || this.height.toString()));

            LayerManager.singleton().update(this.selectedLayer);
        }
    }

    private applyLayer(layer: Layer): void {
        if(this.currContext !== null) {
            //currContext.clearRect(0, 0, currentBoard.attr('width'), currentBoard.attr('height'));
            layer.applyDrawing(this.currContext,
                parseInt(this.currentBoard.attr('width') || this.width.toString()),
                parseInt(this.currentBoard.attr('height') || this.height.toString()));
        }
    }

    getImage(): string {
        const dummyCanvas: JQuery<HTMLCanvasElement> = <JQuery<HTMLCanvasElement>>$("<canvas/>");
        const dummyContext: CanvasRenderingContext2D | null = dummyCanvas.get(0).getContext('2d');

        dummyCanvas.attr('width', parseInt(this.currentBoard.attr('width') || this.width.toString()));
        dummyCanvas.attr('height', parseInt(this.currentBoard.attr('height') || this.height.toString()));

        if (dummyContext !== null) {
            LayerManager.singleton().getAllLayers((layer: Layer, i: string) => {
                if (!layer.Visibility) return;

                layer.apply(dummyContext);
            });

            return dummyCanvas.get(0).toDataURL('image/png');
        } else {
            throw "Dummy context couldn't be loaded";
        }
    }

    resize(w: number, h: number): void {
        this.currentBoard.attr('width', w);
        this.currentBoard.attr('height', h);

        this.backBoard.attr('width', w);
        this.backBoard.attr('height', h);

        this.width = w;
        this.height = h;

        for (let key in this.imageBoards) {
            const img = this.imageBoards[key];
            img.attr('width', w);
            img.attr('height', h);
        }
    }

    bootstrap(parent: JQuery<HTMLElement>): void {
        this.initialize();

        $(parent).append(this.prevBoardParent);
        $(parent).append(this.currentBoard);
        $(parent).append(this.nextBoardParent);

        /** Layer Events */
        StudioEventBus.subscribe(LayersPanelEvents.LAYER_SELECTED, (event: JQuery.Event, data: Layer|null) => {
            try {
                if(data == null) {
                    this.selectedLayer = null;
                    return;
                }

                const id = data.getId();
                if(id !== null) {
                    this.updateAllCanvas(id);
                    this.selectedLayer = data;
                } else {
                    this.selectedLayer = null;
                }
            } catch(e) {
                throw e;
            }
            
        });

        StudioEventBus.subscribe(LayerManagerEvents.VISIBILITY_CHANGED, (event: JQuery.Event, data: Layer) => {
            if (this.selectedLayer !== null && this.currContext !== null && this.selectedLayer.getId() == data.getId()) {
                // update selected layer
                this.selectedLayer = data;

                // if visibility changed for current board
                if (data.Visibility)
                    data.apply(this.currContext);
                else
                    this.currContext.clearRect(0, 0,
                        parseInt(this.currentBoard.attr('width') || this.width.toString()),
                        parseInt(this.currentBoard.attr('height') || this.height.toString()));
            } else {
                const id = data.getId();
                if(id !== null && this.imageBoards[id] !== undefined) {
                    if (data.Visibility)
                        this.imageBoards[id].removeClass('invisible');
                    else
                        this.imageBoards[id].addClass('invisible');
                }
            }
        });

        StudioEventBus.subscribe(LayerManagerEvents.ALPHA_CHANGED, (event: JQuery.Event, data: Layer) => {
            const id = data.getId();

            // if layer is not visible, do nothing
            if (id == null) return;

            if (this.selectedLayer !== null && this.currContext !== null && this.selectedLayer.getId() == data.getId()) {
                // update selected layer
                this.selectedLayer = data;
                
                // current layer opacity is changed, redraw
                this.currContext.clearRect(0, 0,
                    parseInt(this.currentBoard.attr('width') || this.width.toString()),
                    parseInt(this.currentBoard.attr('height') || this.height.toString()));

                if(data.Visibility)
                    data.apply(this.currContext);
            } else if(this.imageBoards[id] !== undefined) {
                // other layer opacity has changed, chnage css opacity of the layer image, will be never called hopefully
                this.imageBoards[id].css({ opacity: data.Alpha });
            }
        });

        /** Brush event */
        StudioEventBus.subscribe(BrushManagerEvents.DRAW_POINT_SUCCESS, (event: JQuery.Event, data: Position) => {
            if(this.selectedLayer !== null) {
                this.saveLayer();
                this.applyLayer(this.selectedLayer);
            }
        });

        /** Filter events */
        StudioEventBus.subscribe(FilterPanelEvents.FILTER_APPLY, (event, filter: Filter) => {
            if (this.selectedLayer !== null && this.backContext !== null) {
                filter.apply(this.backContext);

                this.saveLayer();
                this.applyLayer(this.selectedLayer);
            }
        });
    }
}

export enum BoardEvents {
    MOUSE_DOWN = "board:mouse-clicked",
} 

export const MainBoard: Board = new Board();