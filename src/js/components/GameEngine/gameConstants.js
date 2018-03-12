define([

], function (

) {

    // ###########################################
    // Refactoried NO
    // AMDed       NO
    // Tested      NO
    
    var gameConstants = {
        // Physics engine constants
        'SCALE': 30,
        'FPS' : 60,
        // Objects constants
        'H' : 30,
        'GR_H' : 60,
        'COINH' : 20,
        'COINW' : 150,
        'YGRAVITY' : 10,
        // Window settings
        'CANVAS_H' : 500,
        'CANVAS_WFACTOR' : 0.6,

        'end' : 0

    };

    gameConstants.XGRAVITY = 0 * 0.25*gameConstants.YGRAVITY;
    // Replace the 0 by dir to ensure a fall

    return gameConstants;
});
