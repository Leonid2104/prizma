module.exports = function(mes,aWss,myId,abId){
  aWss.clients.forEach(client => {
    if (client.id == abId ){
      let message = {}
      message.text = mes
      client.send(JSON.stringify(message))
    }
  })
}