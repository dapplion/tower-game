import React from "react";
import Button from './Footer/Button.js';

export default class Header extends React.Component {

  render() {
    return (
      <div class='header'>
        <Button btnId={'Dog'} />
      </div>
    );
  }
}
