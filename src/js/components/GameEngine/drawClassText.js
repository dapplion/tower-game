define([
    'box2d',
    './gameConstants',
    'easeljs'
], function(
    box2d,
    c
) {

    var ControlText = function() {
        this.view = new createjs.Text("", "40px Arial", "black");
        this.view.x = 50;
        this.view.y = 100;
        this.view.textBaseline = "alphabetic";
        this.view.on("tick", tickText, this.view);﻿

    }

    function tickText(e) {
        //this.text = 'c = '+global.count.contract+' dx = '+global.dxNow;
        // #### Remove the global coupling
        // global.dxNow = Math.floor(100/150*(global.xrHover-global.xrLast));
        // this.text = 'dx = '+global.dxNow;
    }

    return ControlText;

});
