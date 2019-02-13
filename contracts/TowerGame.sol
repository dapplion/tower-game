pragma solidity ^0.5.0;


contract TowerGame {
    /* TOWER GAME

    The tower game is based on the idea o piling up wide rectangles in a 2D plane with gravity
    Players can choose the relative distance from the center vertical line of the plane to position
    then next rectangle on top of the previous. This contract will compute the static stability of 
    the rectangles assuming uniform density and equal mass and dimensions.

                      dx
                    |--->
              █████████████
        █████████████
           █████████████
       █████████████
    /=============\

    When a player executes a play, deposits a play price on the contract, `x`. 
    When a play causes `n` coins to fall, the player will be transfered `n*x` as prize.

    Players will call the play function with the desired relative position of the next coin `dx`
    This function will:
    1. Compute the stability of the current tower
    2. If it is unstable and will fall, transfer the prize to the msg.sender 
    3. Update the status of the tower, new coin position and number of coins
    */

    address public owner;
    uint32 public coinCount = 0;
    /* Initial play price set to 0.1 ETH. Contract owner should use `setPlayPrice` to set the desired amount */
    uint public playPrice = 0.1 * 1e18;
    int32[] public coinPositionsArray;

    /* Width is a big integer to allow certain decimal resolution. 
    Width in the context of this contract refers to half of the total rectangle width
    The front end should call the `width` getter to scale their dimensions for this contract
    If the front-end uses pixels to measure the rectangles:
        dx = dxInPixels * (2 * width) / widthInPixels
    */
    int32 constant public width = 1e5/2;

    event PlayResult(address indexed player, int32 dx, uint32 coinCount, uint32 fallingCoins);

    constructor() public {
        owner = msg.sender;
    }

    modifier onlyOwner {
        if (msg.sender != owner) revert("Only owner");
        _;
    }

    function play(int32 dx) public payable {
        /* Verify user is paying the correct amount */
        require(msg.value == playPrice, "Message value must be equal to playPrice");
        require(dx > -width && dx < width, "Coin position must be within width");

        /* Update the dxs so the front-end can draw properly
           dx = relative position from previous coin
           You cannot assign values by index to a dynamic array of length 0.
           Use push to extend the length of the array and direct assignment to replace previous coin positions
        */
        if (coinPositionsArray.length == coinCount) {
            coinPositionsArray.push(dx);
        } else {
            coinPositionsArray[coinCount] = dx;
        }
        
        uint32 fallingCoins = countFallingCoins(coinCount + 1, width, coinPositionsArray);

        if (fallingCoins > 0) {
            // fallingCoins = 1 should never happen because of the require that prevents dx to trigger an immediate fall
            coinCount = coinCount + 1 - fallingCoins;
            msg.sender.transfer(playPrice * fallingCoins);
        } else {
            /* Not a win, add coin to stack */
            coinCount++;
        }

        emit PlayResult(msg.sender, dx, coinCount, fallingCoins);
    }

    function countFallingCoins(uint32 n, int _width, int32[] memory dxArray) public pure returns (uint32) {
        /* Verifies the static stability of piled up planes
        It returns the number of fallen coins or 0 if none falls.
        It swipes the tower from top to bottom. In case of two unstable points, it will return the closest to the top.
        The algorythm is:
            i is a coin counter, equal to 1 on the top coin and increments downwards
            K[i] = (i-1) * K[i-1] / i + dx[i]
            Then check: K[i] < w , K[i] > w
        */
        int k1;
        uint32 i = 1;
        while (i <= n) {
            k1 = (i - 1) * k1 / i + dxArray[n - i];
            if (k1 > _width || k1 < -_width) {
                return i;
            }
            i++;
        }
        return 0;
    }

    function setPlayPrice(uint _playPrice) public onlyOwner {
        require(coinCount == 0, "Play price can only be changed when there are no coins in game");
        playPrice = _playPrice;
    }

    function getCoinPositionsArray() public view returns (int32[] memory) {
        int32[] memory relevantArray = new int32[](coinCount);
        for (uint i = 0; i < coinCount; i++){
            relevantArray[i] = coinPositionsArray[i];
        }
        return relevantArray;
    }

    function kill() public onlyOwner {
        selfdestruct(msg.sender);
    }
}
