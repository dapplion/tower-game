import React from 'react';

export default class Canvas extends React.Component {

  render() {
    return (
      <div>
        <p>'Im on top of the canvas'</p>
        <canvas id='canvas' width='400' height='500'>
            Your browser does not support HTML5 Canvas.
        </canvas>
        <p>'Im under the canvas'</p>
      </div>
    );
  }
}
