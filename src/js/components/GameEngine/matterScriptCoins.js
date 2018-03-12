import Matter from 'matter-js';
import AppStore from 'Store';
import EventBus from 'EventBusAlias';

// General variables
let engine;
let world;
let render;
let canvasParams = {
  width: 600,
  height: 300,
  DOMref: "container"
}
// Physics constants
let groundHeigth = 50;
let coin = {
  width: 100,
  height: 15,
  fill: '#AD9113',
  strokeFill: 'black',
  lineWidth: 1
}
let widthFactor = coin.width/1000;
let activeCoinsArrayRef;

function addMouseControl(render, engine, world) {
  var mouse = Matter.Mouse.create(render.canvas),
    mouseConstraint = Matter.MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: {
          visible: false
        }
      }
    });
  Matter.World.add(world, mouseConstraint);
  // keep the mouse in sync with rendering
  render.mouse = mouse;
}

function setupMatter(DOMref) {
  // create engine
  engine = Matter.Engine.create();
  // create world
  world = engine.world;
  // create renderer
  render = Matter.Render.create({
    element: DOMref,
    engine: engine,
    options: {
      width: canvasParams.width,
      height: canvasParams.height,
      showAngleIndicator: true,
      showIds: true,
      showVelocity: true,
      wireframes: false,
      background: '#4d94ff'
    }
  });
  // Init
  Matter.Render.run(render);
}

export default function(DOMref) {

      var Engine = Matter.Engine,
          Render = Matter.Render,
          Runner = Matter.Runner,
          MouseConstraint = Matter.MouseConstraint,
          Mouse = Matter.Mouse,
          World = Matter.World,
          Bodies = Matter.Bodies;

      // create engine
      setupMatter(DOMref);

      // create runner
      var runner = Runner.create();
      Runner.run(runner, engine);


      createGround();

      EventBus.on('activeCoinsArray',function(activeCoinsArray){
        activeCoinsArrayRef = activeCoinsArray.splice();
        createCoinBodies(activeCoinsArray);
      });

      EventBus.on('animation',function(animationList){
        animationList.forEach(function(animation) {
          switch (animation.type) {
            case 'addDynamicCoin':
              createDynamicCoin(
                animation.coinNum,
                animation.xr
              );
              break;
            case 'switchCoinToDynamic':
              switchCoinToDynamic(
                animation.coinNum
              );
              break;
            default:
              console.warn('UNKOWN animation type: ',animation.type)
          }
        });
      });



      // add mouse control
      addMouseControl(render, engine, world)

      // fit the render viewport to the scene
      Render.lookAt(render, {
          min: { x: 0, y: 0 },
          max: { x: canvasParams.width, y: canvasParams.height }
      });


      // context for MatterTools.Demo
      return {
          engine: engine,
          runner: runner,
          render: render,
          canvas: render.canvas,
          stop: function() {
              Matter.Render.stop(render);
              Matter.Runner.stop(runner);
          }
      };
}

let createGround = function() {
  let ground = Matter.Bodies.rectangle(
    render.canvas.width/2,
    render.canvas.height,
    coin.width,
    groundHeigth,
    {
      isStatic: true,
      id: 'ground'
    }
  );
  Matter.World.add(world, ground);
}

let addCoin = function(coinNum, xr, isStatic=true) {
  let coinAlreadyExists = false;
  let id = String(isStatic)+'_coin_'+coinNum;
  world.bodies.forEach(function(body) {
    if(body.id == id) {
      coinAlreadyExists = true;
    };
  });
  if (coinAlreadyExists) {
    console.log('NOT creating coin, it exists, coinNum ',coinNum,'world',world.id,'#b',world.bodies.length)
  } else {
    console.log('ADDING coin at, coinNum ',coinNum,'world',world.id,'#b',world.bodies.length)
    let x = render.canvas.width/2 + widthFactor*xr;
    let y = render.canvas.height - groundHeigth/2 - coin.height*coinNum - coin.height/2;
    addCoinPure(x, y, id, isStatic);
  }
}

let addCoinPure = function(x, y, id, isStatic) {
  let options = {
    id: id,
    isStatic: isStatic,
    render: {
      fillStyle: coin.fill,
      strokeStyle: coin.strokeFill,
      lineWidth: coin.lineWidth
    }
  }
  let newBody = Matter.Bodies.rectangle(
    x,
    y,
    coin.width,
    coin.height,
    options);
  Matter.World.add(world, newBody);
  if(!isStatic){
    setTimeout(function(){
      Matter.World.remove(world, newBody);
    }, 5*1000);
  }
}


let createCoinBodies = function(activeCoinsArray) {
  let bodiesArray = []
  // console.log('Plotting coins for activeCoinsArray:',activeCoinsArray)

  for (let i = 0; i < activeCoinsArray.length; i++) {
    addCoin(i, activeCoinsArray[i]);
  }
}

let createDynamicCoin = function(coinNum,xr) {
  let id = 'coin_'+coinNum;
  world.bodies.forEach(function(body) {
    if(body.id == id) {
      Matter.World.remove(world, body);
      console.log('Removed '+id+' for a dynamic')
    };
  });
  addCoin(coinNum, xr, false);
};

let switchCoinToDynamic = function(coinNum) {
  let id = 'coin_'+coinNum;
  let foundCoinToRemove = false;
  let x;
  let y;
  world.bodies.forEach(function(body) {
    if(body.id == id) {
      Matter.World.remove(world, body);
      x = body.position.x;
      y = body.position.y;
      foundCoinToRemove = true;
    };
  });
  if (foundCoinToRemove) addCoinPure(x, y, false);
  else console.warn('Did NOT found the coin to switchCoinToDynamic')
}
