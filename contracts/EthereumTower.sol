pragma solidity 0.4.21;

contract EthereumTower{

  /* Last updated March 9 2018 */
    address owner;
    address public winner;
    uint32 public coinCount;
    uint public playPrice;
    uint constant public maxn = 30;
    int32[maxn] public coinPositionsArray;

    /* Game constants, coin width already set a half */
    int32 constant public coinWidth = 1000/2;

    event playResult(address indexed TXid, int32 dx, uint32 currentcount, int32 resultStability);

    function EthereumTower() public {
        owner = msg.sender;
        coinCount = 0;
        playPrice = 0.1 * 1000000000000000000;
    }

    modifier onlyOwner {
    if (msg.sender != owner) revert();
    _;
    }

    function play(int32 dx, address TXid) payable public {
        /* Very user is paying the correct amount */
        assert(msg.value == playPrice);

        /* Check if the coin stack falls */
        uint32 currentcount = coinCount;

        /* Update the dxs so the front-end can draw properly */
        /* dx = relative position from previous coin */
        coinPositionsArray[currentcount] = dx;
        int32 resultStability = checkStability(currentcount, coinWidth);
        /* resultStability = (if fall) new count (else) -1 */
        emit playResult(TXid, dx, currentcount, resultStability);

        if (resultStability>=0) {
            /* Resolve a partial win */
            uint32 numberOfFallenCoins = 1+currentcount-uint32(resultStability);
            if (numberOfFallenCoins>1) {
                /* Multiple coins have fallen */
                /* Only update count if it's necessary */
                coinCount = uint32(resultStability);
            } else {
                /* Only the last coin has fallen */
            }
            withdraw(msg.sender, numberOfFallenCoins);
        } else {
            /* Not a win, add coin to stack */
            coinCount ++;
        }
    }

    function checkStability(uint32 n, int w) internal view returns(int32) {
        /* (if fall) returns new count (else) returns -1 */
        /* input n is current coin count EXCLUDING the new */
        int32 res = -1;
        int f; int k0 = 0; int k1;
        uint32 i = n;
        // Scroll from top (n) to bottom (0)
        while (i < maxn && res < 0) {
        // factor f is 1 for the top coin then, sum 1 downwards
            f = n-i+1;
        // Maybe test the new coin alone to avoid adding uncessarily to storage
            k1 = (f-1)*k0/f+coinPositionsArray[i];
            k0 = k1;
            if (k1 > w) {res = int32(i);}
            else if (k1 < -w) {res = int32(i);}
            i--;
        }
        return res;
    }

    function getCoinPositionsArray() constant public returns (int32[maxn]){
    	return coinPositionsArray;
    }

    function withdraw(address userAccount, uint32 dn) internal {
        // Transfer to the winner the value of the coins fallen
        userAccount.transfer(playPrice*dn);
        winner = userAccount;
    }

    function setPlayPrice(uint _playPrice) onlyOwner public {
        if(coinCount == 0) {
		    playPrice = _playPrice;
        }
    }

    function kill() onlyOwner public { selfdestruct(owner); }

}
