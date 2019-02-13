const TowerGame = artifacts.require("TowerGame");

contract("Ethereum tower", accounts => {
  describe("Contract setters", () => {
    it("should put set a new play price", async () => {
      const towerGameInstance = await TowerGame.deployed();
      const price = web3.utils.toWei(String(1));
      // Check current price
      const currentPrice = await towerGameInstance.playPrice.call();
      assert.equal(
        currentPrice.toString(),
        "100000000000000000",
        "Play price was not set in the constructor"
      );
      // Set new price
      const res = await towerGameInstance.setPlayPrice(price, {
        from: accounts[0]
      });
      console.log(`setPlayPrice: Gas used: ${res.receipt.gasUsed}`);
      // Check new price
      const newPrice = await towerGameInstance.playPrice.call();
      assert.equal(
        newPrice.toString(),
        price,
        "Play price was not set correctly"
      );
    });
  });

  describe("test internal physics resolver: countFallingCoins", () => {
    const width = 50;
    const games = [
      { n: 3, res: 3, dxs: [100, 0, 0], name: "All coins should fall" },
      {
        n: 2,
        res: 2,
        dxs: [100, 0, 0],
        name: "Same dxs only two coins should fall"
      },
      { n: 2, res: 2, dxs: [34, 34], name: "34 x 2 case" },
      { n: 2, res: 0, dxs: [33, 33], name: "33 x 2 case" },
      { n: 3, res: 3, dxs: [26, 26, 26], name: "26 x 3 case" },
      { n: 3, res: 0, dxs: [25, 25, 25], name: "25 x 3 case" },
      { n: 4, res: 4, dxs: [21, 21, 21, 21], name: "21 x 4 case" },
      { n: 4, res: 0, dxs: [20, 20, 20, 20], name: "20 x 4 case" }
    ];

    games.forEach((game, i) => {
      const id = game.name || `#${i}`;
      it(`Should return game result "${id}"`, async () => {
        const towerGameInstance = await TowerGame.deployed();
        const res = await towerGameInstance.countFallingCoins(
          game.n,
          width,
          game.dxs
        );
        assert.equal(
          res.toString(),
          String(game.res),
          `Game did not return the expected result "${id}"`
        );
      });
    });
  });

  describe("execute a game", () => {
    const accountOne = accounts[0];
    const accountTwo = accounts[1];
    let playPrice, width;
    it("should get game constants", async () => {
      const towerGameInstance = await TowerGame.deployed();

      // Get constants to play.
      playPrice = await towerGameInstance.playPrice.call();
      width = await towerGameInstance.width.call();
    });

    it("should execute the first play correctly", async () => {
      const dx = Math.floor(0.9 * width);
      if (!playPrice || !width)
        throw Error(
          "Previous test may have failed, playPrice and width must be defined"
        );
      const towerGameInstance = await TowerGame.deployed();

      // Get initial coin count.
      const initialCoinCount = await towerGameInstance.coinCount.call();
      assert.equal(
        initialCoinCount.toNumber(),
        0,
        "Initial coin count should be zero"
      );

      // Make a play.
      const res = await towerGameInstance.play(dx, {
        from: accountOne,
        value: playPrice
      });
      console.log(`play (1): Gas used: ${res.receipt.gasUsed}`);
      const gameResult = res.logs.find(log => log.event == "PlayResult");
      assert.equal(Boolean(gameResult), true, "PlayResult event not found");
      assert.equal(
        gameResult.args.fallingCoins.toNumber(),
        0,
        "failling coins should equal 0"
      );

      // Get new coin count.
      const finalCoinCount = await towerGameInstance.coinCount.call();
      assert.equal(
        finalCoinCount.toNumber(),
        1,
        "Current coin count should be 1"
      );
    });

    it("should execute the second play correctly", async () => {
      const dx = Math.floor(0.9 * width);
      if (!playPrice || !width)
        throw Error(
          "Previous test may have failed, playPrice and width must be defined"
        );
      const towerGameInstance = await TowerGame.deployed();

      // TEST DEMO
      const towerGameWeb3 = new web3.eth.Contract(
        towerGameInstance.abi,
        towerGameInstance.address
      );
      towerGameWeb3.events.PlayResult().on("data", event => {
        console.log("WEB3 event!");
        console.log(event); // same results as the optional callback above
      });

      // Get initial coin count.
      const initialCoinCount = await towerGameInstance.coinCount.call();
      assert.equal(
        initialCoinCount.toNumber(),
        1,
        "Initial coin count should be 1"
      );
      const initialCoinPositions = await towerGameInstance.getCoinPositionsArray.call();
      assert.equal(initialCoinPositions.length, initialCoinCount.toNumber());
      assert.equal(initialCoinPositions[0].toNumber(), dx);

      // Make a play.
      // - Get previous balance
      const previousBalance = await web3.eth
        .getBalance(accountTwo)
        .then(web3.utils.fromWei);
      const res = await towerGameInstance.play(dx, {
        from: accountTwo,
        value: playPrice
      });
      console.log(`play (2): Gas used: ${res.receipt.gasUsed}`);
      // - Find the relevant log
      const gameResult = res.logs.find(log => log.event == "PlayResult");
      assert.equal(Boolean(gameResult), true, "PlayResult event not found");
      assert.equal(
        gameResult.args.fallingCoins.toNumber(),
        2,
        "failling coins should equal 2"
      );
      // - Get the after balance, ensure the account received the win
      const afterBalance = await web3.eth
        .getBalance(accountTwo)
        .then(web3.utils.fromWei);
      const diff = afterBalance - previousBalance;
      assert.equal(
        Math.round(diff),
        Math.round(web3.utils.fromWei(playPrice)),
        "Balance should have increase by about play price"
      );

      // Get new coin count.
      const finalCoinCount = await towerGameInstance.coinCount.call();
      assert.equal(
        finalCoinCount.toNumber(),
        0,
        "Current coin count should be 0"
      );
      const finalCoinPositions = await towerGameInstance.getCoinPositionsArray.call();
      assert.equal(finalCoinPositions.length, finalCoinCount.toNumber());
    });

    const average = arr => arr.reduce((p, c) => p + c, 0) / arr.length;

    /**
     * Below code is to simulate 100 random plays
     */

    // for (let i = 0; i < 100; i++) {
    //   it(`should play time #${i}`, async () => {
    //     if (!playPrice || !width)
    //       throw Error(
    //         "Previous test may have failed, playPrice and width must be defined"
    //       );
    //     const towerGameInstance = await TowerGame.deployed();

    //     // Make a play.
    //     const dx = Math.floor((2 * Math.random() - 1) * width);
    //     const res = await towerGameInstance.play(dx, {
    //       from: accountOne,
    //       value: playPrice
    //     });
    //     const gameResult = res.logs.find(log => log.event == "PlayResult");
    //     const coinCount = gameResult.args.coinCount.toNumber();
    //     const fallingCoins = gameResult.args.fallingCoins.toNumber();
    //     const dxs = await towerGameInstance.getCoinPositionsArray
    //       .call()
    //       .then(res => res.map(n => n.toNumber()));
    //     const factors = [];
    //     for (let i = 0; i < dxs.length; i++) {
    //       factors[i] = (average(dxs.slice(i)) / width).toFixed(3);
    //     }
    //     console.log(
    //       `play (1): Gas used: ${
    //         res.receipt.gasUsed
    //       }, dx: ${dx}, coin count: ${coinCount}`,
    //       JSON.stringify(factors)
    //     );
    //     if (fallingCoins)
    //       console.log(`\n   WIN! fallingCoins: ${fallingCoins}\n`);
    //   });
    // }
  });
});
