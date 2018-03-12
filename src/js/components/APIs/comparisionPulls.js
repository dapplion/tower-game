let checkConnection = {
  WS_GET_BlockNumber: null,
  HTTP_GET_BlockNumber: null,
  loopInterval: 1000,
  loopInstance: null,
  start: function(web3_HTTPinstance,web3_WBinstance) {
    let that = this;
    this.loopInstance = setInterval(function(){
      if(typeof web3_HTTPinstance !== 'undefined'){
        web3_HTTPinstance.eth.getBlockNumber(function(error, blockNumber){
          if (blockNumber) that.HTTP_GET_BlockNumber = parseInt(blockNumber);
          if (error) console.log('HTTP ERROR: ',error);
        });
      }
      if(typeof web3_WBinstance !== 'undefined'){
        web3_WBinstance.eth.getBlockNumber(function(error, blockNumber){
          if (blockNumber) that.WS_GET_BlockNumber = parseInt(blockNumber);
          if (error) console.log('HTTP ERROR: ',error);
        });
      }
      console.log()
      if(!that.WS_GET_BlockNumber) console.log('WS NOT LOADED')
      if(!that.HTTP_GET_BlockNumber) console.log('HTTP NOT LOADED')
      if(that.WS_GET_BlockNumber && that.HTTP_GET_BlockNumber) {
        let blockNumberDifference = Math.abs(that.HTTP_GET_BlockNumber-that.WS_GET_BlockNumber);
        if (blockNumberDifference > 3) {
          console.log('BN TOO DIFFERENT: HTTP ',that.HTTP_GET_BlockNumber,'WS',that.WS_GET_BlockNumber)
        } else {
          console.log('CONEXION OK')
        }
      }
    },this.loopInterval)
  },
  stop: function() {
    clearInterval(this.loopInstance);
  }
}
