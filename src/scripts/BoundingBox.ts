import { BoundingBox, SetImageDataColor, ImageDataColorAt, RangeMap } from "../utils/Helper";
import { Position } from "../components/Position";
import { Color } from "../components/Color";

//const worker: Worker = <Worker> self;

// Setup an event listener that will handle messages sent to the worker.
self.addEventListener('message', function(e) {
    const data = e.data;
    const imageData = new ImageData(data.imageData.data.slice(), data.imageData.width, data.imageData.height);

    /** Execute bounding box task */
    const borders = BoundingBox(data.imageData, data.position, data.imageData.width, data.imageData.height, (position: Position, color: Color): void => {
        const _color: Color = new Color(data.color.red, data.color.green, data.color.blue, data.color.alpha);
        SetImageDataColor(imageData, position, imageData.width, imageData.height, _color);
    });

    // Send the message back.
    self.postMessage({
        type: 'end',
        data: borders,
        imageData: imageData
    });
  }, false);