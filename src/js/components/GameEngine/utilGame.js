define([
    './gameConstants'
], function(
    c
) {
    // ###########################################
    // Refactoried YES
    // AMDed       YES 
    // Tested      NO

    function yCn(n) {
        y = canvas.height - (c.GR_H+c.COINH*n+c.COINH/2);
        return y;
    };

    function xCn (dxs,n) {
        var x = 0;
        for (var i = 0; i <= n; i++) {
            x += dxs[i];
        }
        if (isNaN(x)) {
            console.warn('CAUTION, corrupt xr value')
            x=0;
        }
        return 1.5*x;
    };
    function lastX () {
        var x = 0;
        for (var i = 0; i < count.contract; i++) {
            x += dxs.contract[i];
        }
        if (isNaN(x)) {x=0;}
        // ##### Remove global coupling!
        // global.xrLast = x;
        //console.log('xrHover='+global.xrHover+' xrL='+global.global.xrLast)
        return x;
    };

    function setCoinGraphics (coinView,alpha) {
        //console.log('alpha: '+alpha)
        var w = c.COINW/2;
        var h = c.COINH/2;
        var c_grd1 = 'rgba(253,159,23,'+alpha+')';
        var c_grd2 = 'rgba(204,122,0,'+alpha+')';
        var c_line = 'rgba(0,0,0,'+0.3*alpha+')';
        coinView.graphics.beginLinearGradientFill([c_grd1, c_grd2], [.1, .9], 0,0,0,2*h )
        .setStrokeStyle(1)
        .beginLinearGradientStroke([c_line, c_line], [.1, .9], 0,0,0,2*h )
        .r(0,0,2*w,2*h);
    }

    function checkStability (dxs,n,countNew) {
        // (if fall) returns new count (else) returns -1
        // input n is current coin count EXCLUDING the new
        var W = 100/2;
        var res = -1, f, k0 = 0;
        var ks = [];
        var i = n; // Scroll from top (n) to bottom (0)
        while (i >= 0 && res < 0) {
            f = n-i+1; // factor f is 1 for the top coin then, sum 1 downwards
            ks[i] = k0 = (f-1)*k0/f+dxs[i];
            if (ks[i] > W) {res = i;}
            else if (ks[i] < -W) {res = i;}
            i--;
        }

        // Find the predominant direction of the fall
        if (countNew == res) {
            console.log('### Fall direction: '+Math.sign(ks[countNew]))
            return Math.sign(ks[countNew]);
        } else {
            console.warn('### CONTRACT DISAGREEMENT ks: '+ks+' Likely '+ks[countNew]+' > '+W)
            var arr = ks.slice(countNew, n);
            var ksAvg = arr => arr.reduce((a,b) => a + b, 0) / arr.length
            return Math.sign(ksAvg);
        }
    }

    return {
        yCn: yCn,
        xCn: xCn,
        lastX: lastX,
        setCoinGraphics: setCoinGraphics,
        checkStability: checkStability
    };

});
