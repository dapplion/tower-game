pragma solidity ^0.4.17;

import "truffle/Assert.sol";
/* Give us assertions for the test */
import "truffle/DeployedAddresses.sol";
/* Truffle deploys a new instance of the contract for tests */
import "../contracts/EthereumTower.sol";
/* Smart contract to test */

contract TestEthereumTower {
  EthereumTower ethereumTower = EthereumTower(DeployedAddresses.EthereumTower());
  int32 dx1 = 48;
  int32 dx2 = 2;
  /* var dxs = [0,dx1];
  var count = 2; */
  int32 coinWidth = 1000/2;
  // Testing the adopt() function
  function testConstantGetter() public {
    int32 returnedVar = ethereumTower.coinWidth();
    Assert.equal(returnedVar, coinWidth, "Get constant: coinWidth");
  }
}
