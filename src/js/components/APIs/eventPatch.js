import EventBus from 'EventBusAlias';
import contract from './kSpecs';


function decodeTXstatus(TXstatus) {
    let decodedStatus;
        if(TXstatus>0 && TXstatus<99){
            decodedStatus = 'Confirmed at #'+TXstatus;
        } else if (TXstatus==1000){
            decodedStatus = 'Will fall';
            // Only this coin fall
        } else if (TXstatus>1000 && TXstatus<1099){
            // Coin fall + dn others
            var dn = TXstatus-1000;
            decodedStatus = 'Will knock '+dn+'coins';
        } else {
            console.warn('## CONTRACT unknown situation = '+TXstatus)
            decodedStatus = 'UNKNOWN'
        }
        return decodedStatus;
    }

    function getTXstatusPromise (TXid) {
            var ii = 0;
            return new Promise(function callback(resolve, reject){
              var TXstatusTimer = setInterval(function(){
                  ii++;
                  // This function will be called repeatedly
                  contract.temporalTxStatusLog(TXid,(err, result) => {
                    let res;
                      if(result != null){
                          res = parseFloat(result);
                          if(res!=0){
                              clearInterval(TXstatusTimer)
                              console.log('Resolved after '+ii+' cycles, res='+res)
                              resolve( res );
                          } else {
                              console.log('TX status is 0')
                          }
                      } else {
                          reject(err);
                      }
                  });
              }, 0.2*1000);
          });
        }

      EventBus.on(EventBus.tag.TXUpdate,function(data){
        if('contractResponse' in data) {
          console.log('EVENT PATCH contractResponse: ',data.contractResponse)
          console.log('EVENT PATCH TXid: ',data.TXid)
          receiveTXstatus(data.TXnum, data.TXid)
        }
      });

      function receiveTXstatus(TXnum, TXid) {
          getTXstatusPromise(TXid).then(function(TXstatus){
            let decodedStatus = decodeTXstatus(TXstatus);
            EventBus.emit(EventBus.tag.TXUpdate, {
              TXid: TXid,
              contractResolved: true,
              status: decodedStatus
            } );
          }).catch(function(err){
              // User declined the transaction
            console.log('ERROR retrieving TX#'+moveObj.TXnum+' status = '+err)
          });
        }
