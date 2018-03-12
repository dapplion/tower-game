import React from 'react';
import { render } from 'react-dom';
import { Stage, Layer, Rect, Text } from 'react-konva';
import Konva from 'konva';
import EventBus from 'EventBusAlias';

class ColoredRect extends React.Component {
  state = {
    color: this.props.color
  };
  handleClick = () => {
    this.setState({
      color: Konva.Util.getRandomColor()
    });
  };
  render() {
    return (
      <Rect
        draggable="true"
        x={this.props.x}
        y={this.props.y}
        width={this.props.w}
        height={this.props.h}
        fill={this.state.color}
        shadowBlur={5}
        onClick={this.handleClick}
      />
    );
  }
}

export default class KonvaReactComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      animatedCoins: {}
    }
    // Bind internal events
    this.handleAnimation = this.handleAnimation.bind(this);
    // Bind external events
    EventBus.on('animation',this.handleAnimation);
  }
  componentDidMount() {
    // Create a reference in this state if you need this in render
    let stageRef = this.refs.stage.props;
  }

  handleAnimation(animationList) {
    console.log('animationList Received',animationList);
    animationList.forEach((animation) => {
      if (animation.type == 'addDynamicCoin') {
        let animatedCoins = this.state.animatedCoins;
        let animatedCoin = {
          coinNum: animation.coinNum,
          coinPosition: animation.coinPosition
        }
        animatedCoins[Date.now()] = animatedCoin;
        this.setState({ animatedCoins });
      }
    });

  }

  render() {
    let w = 100;
    let h = 15;
    // construct static coins layer
    let coins = [];
    let factor = w/1000
    for (let i = 0; i < this.props.coinCount; i++) {
      let xr = 0;
      for (let j = 0; j <= i; j++) {
        xr += this.props.coinPositionsArray[j];
      }
      let y = this.props.stageHeigth - h*(i+1);
      let x = this.props.stageWidth/2 + factor*xr;
      coins.push(
        <ColoredRect
          key={i}
          x={x}
          y={y}
          w={w}
          h={h}
          color={'yellow'}
        />
      )
    }
    // Construct animation layers
    let animatedCoins = [];
    // console.log('this.state.animatedCoin',this.state.animatedCoins)
    for (let animatedCoinKey in this.state.animatedCoins) {
      let animatedCoin = this.state.animatedCoins[animatedCoinKey];
      let xr = 0;
      let i = animatedCoin.coinNum;
      for (let j = 0; j <= i; j++) {
        xr += this.props.coinPositionsArray[j];
      }
      let y = this.props.stageHeigth - h*(i+1);
      let x = this.props.stageWidth/2 + factor*xr;
      animatedCoins.push(
        <ColoredRect
          key={i}
          x={x}
          y={y}
          w={w}
          h={h}
          color={'red'}
        />
      )
    }

    return (
      <div>
        <Stage ref="stage"
          width={this.props.stageWidth}
          height={this.props.stageHeigth}>
          <Layer>
            {coins}
          </Layer>
          <Layer>
            {animatedCoins}
          </Layer>
        </Stage>
      </div>
    );
  }
}
