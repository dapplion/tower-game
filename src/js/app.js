import 'jquery';
import '../css/main.scss';
import React from "react";
import ReactDOM from "react-dom";
import { RandomGenerator } from './random-generator';


// const outputParagraph = $('#outputParagraph');
//
// const outputRandomInt = () => {
//     outputParagraph.text('lol '+RandomGenerator.randomInteger());
// };
//
// const outputRandomRange = () => {
//     outputParagraph.text(RandomGenerator.randomRange(1, 500));
// };
//
// const outputImage = () => {
//   console.log(AddImage)
//     AddImage.Logo();
// };
//
// const outputImageDog = () => {
//   console.log(AddImage)
//     AddImage.Dog();
// };
//
// const buttonRndInt = document.querySelector('#randomInt');
// const buttonRndRange = document.querySelector('#randomRange');
// const buttonImage = document.querySelector('#image');
// const buttonImageDog = document.querySelector('#imageDog');
//
// buttonRndInt.click(outputRandomInt);
// buttonRndRange.addEventListener('click', outputRandomRange);
// buttonImage.addEventListener('click', outputImage);
// buttonImageDog.addEventListener('click', outputImageDog);

import Header from './components/Header.js';
import Footer from './components/Footer.js';
import ConnexionModule from './components/ConnexionModule.js';
import GameDisplay from './components/GameDisplay.js';
import TransactionsLog from './components/TransactionsLog.js';


class Layout extends React.Component {
  render() {
    return (
      <div>
        <Header />
        <ConnexionModule />
        <GameDisplay />
        <TransactionsLog />
        <Footer />
      </div>
    );
  }
}

const app = document.getElementById('app');
ReactDOM.render(<Layout />, app);
