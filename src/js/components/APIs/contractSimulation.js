// ###########################################
// Refactoried YES
// AMDed       YES
// Tested      YES

var dxs = [12,13,14];
var count = 3;
var fact = 1e0;
var W = 100*fact/2;
var ksLog;

function play(dx) {
    // Receive the dx, check stability
    dxs[count] = dx;

    var res = checkStability(dxs,count);
    if (res < 0) {
        count++;
    } else {
        count = res;
    }
    // console.log('count='+localStorage.count+' dxs='+localStorage.dxs)
}

// IN CONTRACT functions
function checkStability(dxs,n) {
    // (if fall) returns new count (else) returns -1
    // input n is current coin count EXCLUDING the new
    var res = -1, f, k0 = 0, k1;
    var ks = [];
    var i = n; // Scroll from top (n) to bottom (0)
    while (i >= 0 && res < 0) {
        f = n-i+1; // factor f is 1 for the top coin then, sum 1 downwards
        k1 = (f-1)*k0/f+dxs[i];
        k0 = k1;
        ks[i] = k0;
        if (k1 > W) {res = i;}
        else if (k1 < -W) {res = i;}
        i--;
    }
    ksLog = ks;
    return res;
}

function getCount(callback) {
    callback(null, count);
}

function getDxs(callback) {
    callback(null, dxs);
}

function getksLog() {
    return ksLog;
}

function getW(callback) {
    callback(null, W);
}

function setCount(countNew) {
    count = countNew;
}

function setDxs(dxsNew) {
    dxs = dxsNew;
}

export {
    play,
    getCount,
    getDxs,
    getksLog,
    getW,
    setCount,
    setDxs
};
