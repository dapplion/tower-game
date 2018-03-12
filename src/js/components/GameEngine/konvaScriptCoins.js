import Konva from 'konva';

function Box(x, y, w, h, Bodies, world, World, layer, isStatic=false) {
  var options = {
    friction: 0.3,
    restitution: 0.6,
    isStatic: isStatic
  }
  this.body = Bodies.rectangle(x, y, w, h, options);
  this.w = w;
  this.h = h;
  World.add(world, this.body);

  this.view = new Konva.Rect({
    x: x,
    y: y,
    width: w,
    height: h,
    // offset: {
    //   x: 100,
    //   y: 10
    // },
    fill: 'green',
    stroke: 'black',
    strokeWidth: 4
  });
  layer.add(this.view);

  this.show = function() {
    this.view.setX(this.body.position.x);
    this.view.setY(this.body.position.y);
    this.view.rotate(toDegrees(this.body.angle-this.body.anglePrev))
    // if (this.body.angle != 0) {
    //   console.log('Angle: ',this.body.angle)
    // }

  }
}

function toDegrees (angle) {
  return angle * (180 / Math.PI);
}

export default function(DOMel) {
  var stage = new Konva.Stage({
      container: DOMel,
      width: window.innerWidth,
      height: window.innerHeight
    });
    var layer = new Konva.Layer();
    // add the layer to the stage
    stage.add(layer);

    // module aliases
    var Engine = Matter.Engine,
      // Render = Matter.Render,
      World = Matter.World,
      Bodies = Matter.Bodies;

    var engine = Engine.create();
    var world = engine.world;
    // new Box(x, y, w, h, Bodies, World, layer)

    var boxes = [];
    boxes.push(new Box(300, 200, 500, 30, Bodies, world, World, layer, true));

    stage.on('contentClick', function () {
      console.log('HI click')
      let x = stage.getPointerPosition().x;
      let y = stage.getPointerPosition().y;
      let w = 50;
      let h = 20;

      boxes.push(new Box(x, y, w, h, Bodies, world, World, layer));
      // layer.batchDraw();
    });





    var anim = new Konva.Animation(function(frame) {
    var time = frame.time,
        timeDiff = frame.timeDiff,
        frameRate = frame.frameRate;
        Engine.update(engine);
        for (var i = 0; i < boxes.length; i++) {
          boxes[i].show();
        }
    // update stuff
    }, layer);

    anim.start();
}
