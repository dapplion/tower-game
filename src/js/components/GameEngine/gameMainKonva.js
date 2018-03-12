import constants from './gameConstants';
import Coin from './drawClassCoin';
import { Ground } from './drawClassGround';
import util from './utilGame';
import { box2d } from 'Lib/box2dConfig';
import EventBus from 'EventBusAlias';
import Konva from 'konva';


    // #########################################
    // Refactoried YES
    // AMDed       MEH
    // Tested      NO

    // Load constants
    var c = constants;

    // Store necessary constants
    var count = 0;
    var dxs = Array.apply(null, Array(32)).map(Number.prototype.valueOf,0);
        // Initialize the dxs array to prevent possible errors before it is loaded
    var world;
    var stage;
    var layer;
    var game = {};

    // Control lists
    var listAdd = [];
    var listSwitch = [];
    var listFixDx = [];
    var listAddGhost = [];
    var coinLog = [];
    var coinLogFalling = [];
    var pendingTXLog = {};
    var hoverPositionXr = 0;
    var lastCoinPositionXr = 0;
    var hoveringCoin;
    var currentDx;
    var fallDirection;

    // Bind events
    EventBus.on('dxsUpdate', dxsUpdated);
    EventBus.on('countUpdate', countUpdated);
    function bindStage(stage) {
        stage.addEventListener("stagemousemove", moveCanvas);
        stage.addEventListener("stagemousedown", clickCanvas);
    }
    EventBus.on('TX.statUpdate', TXstatusUpdated);
    EventBus.on('lastCoinPositionXrUpdated', function(msg, newVal){
        lastCoinPositionXr = newVal;
        publishCurrentDx();
    });

    function TXstatusUpdated(msg, data) {
        // fired: true
        // userResponse: true -> Created Ghost coin
        if ('userResponse' in data && data.userResponse) {
            pendingTXLog[data.TXid] = {dx: data.dxSelection};
        // contractResponse: false -> Remove Ghost coin
        } else if ('contractResponse' in data && !data.contractResponse) {
            pendingTXLedger.removeTX(pendingTXLog[data.TXid])
        }
    }
    function checkForExistingGhostCoin(coinNum) {
        var dx = dxs[coinNum]
        for (var TXid in pendingTXLog) {
            var TX = pendingTXLog[TXid];
            console.log('Real coin: n='+coinNum+' dx='+dx+' / G n='+TX.coinNum+' dx='+TX.dx)
            if ('coinNum' in TX
            && TX.coinNum == coinNum
            && 'dx' in TX
            && TX.dx == dx) {
                pendingTXLedger.removeTX(TX)
                console.log('- deleted')
            }
        }
    }

    var pendingTXLedger = {
        count: 0,
        dxs: [],
        addTX : function(TX) {
            TX.pendingTXnum = this.count;
            this.dxs[this.count] = TX.dx;
            TX.coinNum = count+this.count;
            this.count++;
        },
        removeTX : function(TX) {
            stage.removeChild(TX.animation.view);
            this.dxs.splice(TX.pendingTXnum,1);
            this.count--;
            //delete TX;
        }
    };

    function clickCanvas(evt) {
        EventBus.emit('fireTX', currentDx);
    }

    //sparkle trail
    function moveCanvas(evt) {
        let xrMouse = stage.mouseX - stage.canvas.width/2;
        let  limitLeft = lastCoinPositionXr - c.COINW/2;
        let limitRight = lastCoinPositionXr + c.COINW/2;
        if (xrMouse > limitRight) {xrMouse = limitRight;}
        if (xrMouse < limitLeft ) {xrMouse = limitLeft;}
        hoverPositionXr = xrMouse;
        publishCurrentDx();
    }

    function publishCurrentDx() {
        currentDx = Math.floor((hoverPositionXr - lastCoinPositionXr)/1.5);
        EventBus.emit('currentDxUpdated', currentDx);
    }

    // Define subcribing functions
    function dxsUpdated(msg, dxsNew) {
        dxs = dxsNew;
    };
    function countUpdated(msg, countNew) {
        // ##### Good idea to implement the logic here??
        if (countNew < count) {
            // Check in which direction the coins fall
            fallDirection = util.checkStability(dxs,count,countNew)
            // If coins dropped add the topping coin
            listAdd.push({coinNum: count, type: 'dynamic'});
            checkForExistingGhostCoin(count);
            for (var i = countNew; i < count; i++) {
                coinLog[i].body.dir = fallDirection;
                listSwitch.push(coinLog[i].body)
            }
        } else {
            for (var i = count; i < countNew; i++) {
                listAdd.push({coinNum: i, type: 'static'})
                checkForExistingGhostCoin(i);
            }
        }
        count = countNew;
        // Update the last coin position
        EventBus.emit('lastCoinPositionXrUpdated', util.xCn(dxs,count-1));

    };

    init()

    function init() {
        // GENERATE RANDOM DX
        stage = new Konva.Stage({
          container: 'canvas',   // id of container <div>
          width: 500,
          height: 500
        });
        layer = new Konva.Layer();
        stage.add(layer);
        bindStage(stage);
        setupPhysics();
        resize();

        // var ground = new Ground(world,stage,layer);

        // hoveringCoin = new Coin.CoinHovering(layer);
        // stage.addChild(hoveringCoin.view);

        var anim = new Konva.Animation(handleTick(frame), layer);
        anim.start();
     };

    function setupPhysics() {
      console.log('box2d',box2d)
        world = new box2d.b2World(
            new box2d.b2Vec2(0, 20)    //gravity
         ,  true                 //allow sleep -  better performance
        );
    };

    function resize() {
        var width = Math.floor(c.CANVAS_WFACTOR * window.innerWidth);
        if (stage.width != width) {
            reCenterStaticBodies(width);
            stage.width = width;
            stage.height = c.CANVAS_H;
        }
    }

    function reCenterStaticBodies(width) {
        for ( var body = world.GetBodyList(); body; body = body.GetNext() ){
            if (body.GetType() == box2d.b2Body.b2_staticBody) {
                var pos = body.GetPosition();
                pos.x = (body.xr+width/2)/c.SCALE;
            }
        }

    }

    function handleTick(frame) {

      var time = frame.time,
          timeDiff = frame.timeDiff,
          frameRate = frame.frameRate;

        resize();

        stage.update();
        //game.world.DrawDebugData();
        world.Step(
            timeDiff  //frame-rate
            ,10     //velocity iterations
            ,10     //position iterations
        );
        world.ClearForces();

        // MANAGE SWITCHES
        listSwitch.forEach(function(body) {
            body.SetType(box2d.b2Body.b2_dynamicBody);
            // coinLogFalling.push(body);
        });
        // MANAGE ADDS
        for (var i in listAdd) {
            var cn = new Coin.CoinInTower(dxs,listAdd[i].coinNum,listAdd[i].type,world,stage);
            if (listAdd[i].type == 'static') {
                // Extra references to manage easy removing
                coinLog[listAdd[i].coinNum] = cn.view;
            } else {
                // ##### SHITTY PATCH, coins created here, are bound to fall
                cn.view.body.dir = fallDirection;
                listSwitch.push(cn.view.body)
            }
        }
        listAdd.length = 0; // Reset the array

        for (var TXid in pendingTXLog) {
            var TX = pendingTXLog[TXid];
            if (!Boolean(TX.animation)) {
                console.log('## Placed Ghost, dx: '+TX.dx)
                TX.animation = new Coin.CoinGhost(TX.dx,
                    dxs,
                    count,
                    pendingTXLedger.dxs,
                    pendingTXLedger.count,
                    stage);
                pendingTXLedger.addTX(TX);
            }
        }

        // if (pendingTXLedger.count == 0) {
        //     console.log('pendingTXLedger.count: '+pendingTXLedger.count)
        // }

        // MANAGE FIXES
        // for (var i in listFixDx) {
        //     var y = lists.fix.body.GetPosition().y;
        //     var x = lists.fix.newx;
        //     lists.fix[i].body.SetPosition(x,y);
        // }

        // Comunicate to the selector
        hoveringCoin.view.x = hoverPositionXr + stage.canvas.width/2;

        // MANAGE FALLING COINS - ensure fall + Removal self-destruct
        var XGRAVITY = 20;
        for ( var body = world.GetBodyList(); body; body = body.GetNext() ){
            // Apply falling forces
            if (body.dir != 0) {
                body.ApplyForce(new box2d.b2Vec2(body.dir*XGRAVITY), body.GetWorldCenter());
            }
            // Remove coins
            if (body.destroyNow) {
                world.DestroyBody(body)
                stage.removeChild(body.parentView)
            }
        }
    };
