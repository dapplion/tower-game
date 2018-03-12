import constants from './gameConstants';
import { box2d } from 'Lib/box2dConfig';
import Konva from 'konva';

// ###########################################
// Refactoried NO
// AMDed       NO
// Tested      NO

// Get constants
var SCALE = constants.SCALE;
var stageCache;

var Ground = function(world,stage,layer) {
  stageCache = stage;
  // Positions are fixed
  let xr = 0;
  let x = xr + 500/2;
  let y = 500-constants.GR_H/2;
  let h = constants.GR_H/2;
  let w = constants.COINW/2;

  // ground.png dimensions = 384 x 128
  // Box2D width and height are halfs
  let bitmapW = 384/2;
  let bitmapH = 128/2;

  // BITMAP!!!
  var imageObj = new Image();
  imageObj.onload = function() {
    var yoda = new Konva.Image({
      x: x,
      y: y,
      image: imageObj,
      width: bitmapW,
      height: bitmapH
    });
    // add the shape to the layer
    layer.add(yoda);
    // add the layer to the stage
    stage.add(layer);
  };
  imageObj.src = 'http://www.photonstorm.com/wp-content/uploads/2015/01/platform.png';
}

export { Ground };
