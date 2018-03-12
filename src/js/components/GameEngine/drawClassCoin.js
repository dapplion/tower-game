  import constants from './gameConstants';
  import { box2d } from 'Lib/box2dConfig';
  import Konva from 'konva';
  import util from './utilGame';


    // ###########################################
    // Refactoried NO
    // AMDed       NO
    // Tested      NO

    // #######################
    // Basic constructors

    var BasicBox2DRectangle = function(x,y,type,world) {
        // Create coin coords
        var w = c.COINW;
        var h = c.COINH;
        var fixDef = new box2d.b2FixtureDef;
        fixDef.density = 1.0;
        fixDef.friction = 0.2;
        fixDef.restitution = 0.2;
        var bodyDef = new box2d.b2BodyDef;
        if (type == 'static') {
            bodyDef.type = box2d.b2Body.b2_staticBody;
        } else if (type == 'dynamic') {
            bodyDef.type = box2d.b2Body.b2_dynamicBody;
        } else {
            console.warn('UNKNOWN TYPE')
        }
        bodyDef.position.x = x / c.SCALE;
        bodyDef.position.y = y / c.SCALE;
        fixDef.shape = new box2d.b2PolygonShape;
        fixDef.shape.SetAsBox(w/c.SCALE,h/c.SCALE);
        // Add to the world
        this.view.body = world.CreateBody(bodyDef);
        this.view.body.CreateFixture(fixDef);
    };

    var BasicCoinView = function(layer,alpha=1) {
      var c_grd1 = 'rgba(253,159,23,'+alpha+')';
      var c_grd2 = 'rgba(204,122,0,'+alpha+')';
      var c_line = 'rgba(0,0,0,'+0.3*alpha+')';
      this.view = new Konva.Rect({
        x: 0,
        y: 0,
        width: c.COINW,
        height: c.COINH,
        fillLinearGradientStartPoint: { x : 0, y : -c.COINW/2},
        fillLinearGradientEndPoint: { x : 0, y : c.COINW/2},
        fillLinearGradientColorStops: [0, c_grd1, 1, c_grd2],
        stroke: c_line,
        strokeWidth: 1
      });
      // Add to the stage
      layer.add(this.view);
    };

    // #######################
    // Specific constructors

    // Coin in tower, static and dynamic box2d
    var CoinInTower = function(dxs,n,type,world,layer) {
        // Create coin coords
        var xr = util.xCn(dxs,n);
        var x = xr + stage.canvas.width/2;
        var y = util.yCn(n);

        BasicCoinView.call(this,layer)
        BasicBox2DRectangle.call(this,x,y,type,world)

        this.view.on("tick", tickCoinInTower, this.view);﻿
        // Add tag to get xr Positions
        this.view.body.xr = xr;
        this.view.body.destroyNow = false;
        this.view.body.parentView = this.view;
    };
    function tickCoinInTower(e) {
        this.x = this.body.GetPosition().x * c.SCALE;
        this.y = this.body.GetPosition().y * c.SCALE;
        this.rotation = this.body.GetAngle() * (180/Math.PI);
        if (this.body.GetType() == box2d.b2Body.b2_dynamicBody) {
            var body = this.body;
            // set-up a self desctruction mechanism
            setTimeout(function(){
                body.destroyNow = true;
            }, 5000);

        }
    };

    // easeljs animation only, will be destroyed afterwards
    var CoinGhost = function(currentDx,dxs,n,dxsPending,nPending,layer) {
        var alpha = 0.5;
        BasicCoinView.call(this,layer,alpha)
        // Create coin coords
        this.view.xr = currentDx*1.5+util.xCn(dxsPending,nPending-1)+util.xCn(dxs,n-1);
        this.view.x = this.view.xr + stage.canvas.width/2;
        this.view.y = 50;
        console.log(nPending)
        this.view.yEnd = util.yCn(n+nPending); // future count position
        this.view.dy = 5; // Vertical speed
        // Add to the stage
        this.view.on("tick", tickCoinGhost, this);﻿
    };
    function tickCoinGhost(e) {
        if (this.view.y + this.view.dy <= this.view.yEnd) {
            this.view.y += this.view.dy;
        }
    };

    // easeljs animation only, permanent
    var CoinHovering = function(layer) {
        BasicCoinView.call(this,layer);
        // Create coin coords
        this.view.xr = 0;
        this.view.x = this.view.xr + stage.canvas.width/2;
        this.view.y = 50;
        // Add to the stage
        this.view.on("tick", tickCoinHovering, this.view);﻿
    };
    function tickCoinHovering(e) {
        // this.alphaParam = this.alphaParam - 0.01;
        // if (this.alphaParam < 0.1) {
        //     this.alphaParam = 1;
        // }

    };

  export {
    CoinInTower,
    CoinGhost,
    CoinHovering,
  };
