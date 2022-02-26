const addMesCl = require('./wsAddMes')
module.exports = function(ws,method,message,paramId,aWss){
  switch (method){
    case 'ADD_MES':
      {
        addMesCl(message.text,aWss,paramId,message.userId)
        console.log(message.text)
        return 0;
      }
    case 'CONNECTION':
      {
        ws.id =paramId
        console.log(paramId)
      }
  }
}
  
