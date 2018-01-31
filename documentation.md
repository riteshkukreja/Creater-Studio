# Creater Studio App Documentation
# ================================

## Functionalities
-	Canvas based drawing page
-	configurable canvas size
-	tools such as pen, pencil, brush, fill bucket, selection
-	layers based design (each layer represent a canvas)
-	grouping of layers
-	mouse (tool design) should be shown on top second layer (not shown in layer panel)
-	context menu should appear on top most layer
-	Menu is divided into horizontal menu and vertical menu
-	each module works independently and can communicate using events
-	event manager shuould record each even listener and propogate events.
-	all modules and services only communicate with event manager

## Event Model
### Event Interface
interface Event {
	timestamp: long;
	type: string;
}

Each event implements the Event interface
### SingleClickEvent Interface
Contains the event information for a single left click on the canvas
interface SingleClickInterface extends Event {
	position: Position;
	type: 'clickEvent'
} 
-	DoubleClickEvent
-	RightClickEvent

### DragEvent Interface
Contains information about drag event from position a to position b
interface DragEvent extends Event {
	startPos: Position;
	endPos: Position;
	duration: long;
}

### EventHandler Interface
Defines method to handle a particular event
interface EventHandler {
	public handleEvent(Event event);
}

### SingleClickEventHandler 
interface SingleClickEventHandler extends EventHandler {
	public handleEvent(SingleClickEvent event);
}

### Registring for event
class PenToolSelector implements SingleClickEventHandler, RightClickEventHandler {
	PenTool tool = null;
	
	public handleEvent(SingleClickEvent event) {
		tool = PenTools.selectFirst();
	}

	public handleEvent(DoubleClickEvent event) {
		PenTool.showAll();
	}
}

EventRegistryManager.register(SingleClickEvent, PenToolSelector);
EventRegistryManager.register(RightClickEvent, PenToolSelector);

### Throwing event
SingleClickEvent singleClickEvent = new SingleClickEvent(
	position: Position
);


EventRegistryManager.propogateEvent(singleClickEvent);