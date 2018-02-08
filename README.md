# Creater Studio App
# ================================
Drawing application for web. It aims to provide photo editing tool functionality.

[Demo](https://riteshkukreja.github.io/Creater-Studio/)

## Tasks
### Tools
- [x] Brush Tool for drawing on canvas. Types of brushes should be easily created using a common architecture and easily injectable.  
- [ ] Add pen tool/spray tool with duplicatin brush tool functionality.
- [x] Paint Bucket Tool for color in a region (needs web workers) (make fill faster)
- [x] Erase Tool for remove portion of canvas
- [ ] Selection Tool to select a region of canvas for furthur actions

### Menus
- [ ] A common architecture to easily add and inject a menu or menu group.
- [ ] A menu item should have a action associated with it to execute on click
- [ ] A menu group should have a list of menu Items and oriantation in which it should expand on mouse hover/click 

### Buses
- [ ] Each module should have its own bus for local events and use global bus for global events
- [x] Debug property for the bus to show all its events in console
- [x] All async events or inter-module events should go through event bus.

### History
- [ ] All events/actions should be recorded in one module. Passed through eventbus.
- [ ] Actions like Undo/Redo could be provided using the history information.
- [ ] each action should have on dummy canvas and recorded and then added to current cannvas for reversability.

### Board
- [ ] Custom size boards.
- [ ] Add tool to allow user to create its own size board (like illustrator)
- [ ] Naming on boards and allow ordering.
- [ ] Duplicate boards.
- [x] (Debugging) show mouse position at top-left corner.

### Layers
- [x] Layers based design (each layer represent a canvas)
- [ ] Grouping of layers and grouped actions
- [ ] Duplication of layers/groups

### Context Menu
- [ ] Show context menu on canvas/tools/layers/filters
- [ ] Each context menu item should have an action.

### Modules
- [x]  Each module should have an UI and Manager.
- [x]  Each module should only communicate with a event bus and work independently.
- [x]  each module should export a address on which other modules can listen for events.

### Images
- [ ] Allow image upload and manipulation
- [x] Allow image download

### Filters
- [x] Allow custom filter creation based on current canvas
- [ ] Allow filter creation based on actions/history

### Panels
- [x] Draggable panels on screen
- [x] Should allow easy injectability to add any Sub Panel
- [ ] Sub Panel should be able to drragged from on epanel to another or create their own panel if dragged outside all panels.

### Workers
- [x] Make worker easy to use (async/await)

## Known Bus
- [ ] Entire screen push up on selecting any subpanel in Layers_Filter panel
- [ ] Paint fill takes long time (optimization needed)
- [ ] Doesn't have good description for the project. Think of something cool to add.