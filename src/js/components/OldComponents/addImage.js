import * as urlLogo from '../img/webpack-logo.png';
import * as urlDog from '../img/dog.png';

var AddImage = class {
    static Logo() {
      let img = document.createElement('img');
      img.style = {
        height: '25%',
        width: '25'
      };
      // Add this to pause execution and debug
      // debugger;

      img.src = urlLogo.default;
      document.getElementById('img_container').appendChild(img);
    }

    static Dog() {
      let img = document.createElement('img');
      img.style = {
        height: '25%',
        width: '25'
      };
      // Add this to pause execution and debug
      // debugger;

      img.src = urlDog.default;
      img.src = 'https://instagram.fmad3-2.fna.fbcdn.net/vp/9f5e99b51ec3b1bfd9464884c86c2d4a/5B1C512A/t51.2885-15/e35/26863425_1922601974448144_4189053840567304192_n.jpg'
      document.getElementById('img_container').appendChild(img);
    }
}


export { AddImage };
