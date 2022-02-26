const messageListen = require('./webSocket/messages')
require('dotenv').config()
const fileUpload = require('express-fileupload')
const express = require(`express`)
const sequelize = require('./db')
const models = require('./models/models')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const router =require('./routs/index')
const errorHandler = require('./middleware/errorHandlinkMiddleware')
const { model } = require('./db')
const appWs = express()
const filePathMiddleware = require('./middleware/filePathMiddleware')
const WsServer = require('express-ws')(appWs)
const path = require('path')
const aWss = WsServer.getWss()
const PORT = process.env.PORT || 5000

appWs.ws('/:id',(ws,req) =>{
  console.log('Start')
  messageListen(ws,'CONNECTION',{},req.params.id,aWss)
  ws.on('message',(message)=>{
    messageListen(ws,JSON.parse(message).method,JSON.parse(message),req.params.id,aWss)
  })
})

const startWs = async () => {
  try{
    await sequelize.authenticate()
    await sequelize.sync()
    appWs.listen(9000,() =>{console.log('WebSocket started')})
  }catch(e){
    console.log(e)
  }
}



const app = express()
app.use(cookieParser())
app.use(fileUpload({}))
app.use(cors({
  credentials: true,
  origin: "http://localhost:3000"
}))
app.use(express.static('files'))
app.use(express.json())
app.use(filePathMiddleware(path.resolve(__dirname,'files')))
app.use('/api', router)
app.use(errorHandler)
const start = async () => {
  try{
    await sequelize.authenticate()
    await sequelize.sync()
    app.listen(PORT, () => console.log(`Server started on ${PORT}`))
  }catch(e){
    console.log(e)
  }
}
start()
startWs()


