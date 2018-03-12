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
  let x = xr + stage.canvas.width/2;
  let y = canvas.height-constants.GR_H/2;
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
  this.view = new createjs.Bitmap("img/ground.png");
  this.view.regX = bitmapW;
  this.view.regY = bitmapH;
  this.view.scaleX = w/bitmapW;
  this.view.scaleY = h/bitmapH;


  var fixDef = new box2d.b2FixtureDef;
  fixDef.density = 1.0;
  fixDef.friction = 0.2;
  fixDef.restitution = 0.5;
  var bodyDef = new box2d.b2BodyDef;
  bodyDef.type = box2d.b2Body.b2_staticBody;
  bodyDef.position.x = x / SCALE;
  bodyDef.position.y = y / SCALE;
  fixDef.shape = new box2d.b2PolygonShape;
  fixDef.shape.SetAsBox(w/SCALE,h/SCALE);
  // Add to the world
  this.view.body = world.CreateBody(bodyDef);
  this.view.body.CreateFixture(fixDef);
  // Add to the stage
  this.view.on("tick", tickGround, this.view);﻿
  stage.addChild(this.view);
  // Add tag to get xr Positions
  this.view.body.xr = xr;
}

function tickGround(e) {
  this.x = this.body.GetPosition().x * SCALE;
  this.y = this.body.GetPosition().y * SCALE;
  this.rotation = this.body.GetAngle() * (180/Math.PI);
}

export { Ground };
