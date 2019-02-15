import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { Stage, Layer, Rect, Text } from "react-konva";
import Konva from "konva";

const BackgroundGradient = ({ bottom, top, height, width }) => (
  <Rect
    width={width}
    height={height}
    fillLinearGradientStartPoint={{ x: 0, y: 0 }}
    fillLinearGradientEndPoint={{ x: 0, y: height }}
    fillLinearGradientColorStops={[0, top, 1, bottom]}
  />
);

const Base = props => (
  <Rect
    {...props}
    fillLinearGradientStartPoint={{ x: 0, y: 0 }}
    fillLinearGradientEndPoint={{ x: 0, y: props.height }}
    fillLinearGradientColorStops={[0, "#5a3f37", 1, "#2c7744"]}
  />
);

class ColoredRect extends React.Component {
  state = {
    color: "yellow"
  };
  handleClick = () => {
    this.setState({
      color: Konva.Util.getRandomColor()
    });
  };
  render() {
    return (
      <Rect
        {...this.props}
        fillLinearGradientStartPoint={{ x: 0, y: 0 }}
        fillLinearGradientEndPoint={{ x: this.props.width, y: 0 }}
        fillLinearGradientColorStops={[0, "#f7971e", 1, "#ffd200"]}
        stroke={"#8c6300"}
        strokeWidth={1}
        onClick={this.handleClick}
      />
    );
  }
}

// "#2bc0e4", 1, "#eaecc6"
const canvasMaxWidth = 600;
function computeWidth() {
  return window.innerWidth < canvasMaxWidth
    ? window.innerWidth
    : canvasMaxWidth;
}
function computeScale() {
  return window.innerWidth < canvasMaxWidth
    ? window.innerWidth / canvasMaxWidth
    : 1;
}

class DisplayGameState extends React.Component {
  constructor(props) {
    super(props);
    this.state = { stageWidth: computeWidth(), stageScale: computeScale() };
  }

  fitStageIntoParentContainer() {
    this.setState({ stageWidth: computeWidth(), stageScale: computeScale() });
  }

  componentDidMount() {
    window.addEventListener(
      "resize",
      this.fitStageIntoParentContainer.bind(this)
    );
  }
  render() {
    console.log(this.state);
    // Positions array
    const gameState = this.props.gameState || [];
    // Size constants
    const canvasMaxWidth = 600;
    const canvasMaxHeight = 800;

    const width = 200;
    const height = 30;
    const baseHeight = 100;

    // Actual variables used in render
    // NOT RESPONSIVE
    // const stageScale = 1;
    // const canvasWidth = canvasMaxHeight;
    // RESPONSIVE
    const stageScale = this.state.stageScale;
    const canvasWidth = this.state.stageWidth;
    // ====
    const canvasHeight = canvasMaxHeight;
    const halfWidth = width / 2;
    const startingY = canvasHeight - baseHeight;
    const startingX = canvasWidth / stageScale / 2;

    console.log({ gameState });
    return (
      <div>
        <Stage
          style={{
            padding: 0,
            margin: "auto",
            display: "block"
          }}
          width={canvasWidth}
          height={canvasHeight * stageScale}
          scaleX={stageScale}
          scaleY={stageScale}
        >
          <Layer>
            <BackgroundGradient
              width={canvasMaxWidth}
              height={canvasHeight}
              bottom={"#eaecc6"}
              top={"#2bc0e4"}
            />
          </Layer>
          <Layer>
            <Base
              x={startingX - width / 2}
              y={canvasHeight}
              width={width}
              height={-baseHeight + height}
            />
          </Layer>
          <Layer>
            {gameState.map((x, i) => (
              <ColoredRect
                key={i}
                x={startingX + halfWidth * x - width / 2}
                y={startingY - i * height}
                width={width}
                height={height}
              />
            ))}
          </Layer>
        </Stage>
      </div>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  gameState: state => state.gameState
});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DisplayGameState);
