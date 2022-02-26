const ApiError = require('../error/ApiError')
const bcrypt = require('bcryptjs') 
const jwt = require('jsonwebtoken')

const {MessageItem,Messages,Chats,ChatItem,User} = require('../models/models')
class MesContr{
  async addMessage(req,res,next){ 
    try{
      console.log(req.params.id)
      const token = req.cookies.access_token
      const decoded = jwt.verify(token, process.env.SECRET_KEY)
      const user = await User.findOne({where:{email: decoded.email}})
      const chats = await Chats.findOne({where:{userId:user.id}})
      const chatsAb = await Chats.findOne({where:{userId:req.params.id}})
      let chat = await ChatItem.findOne({where:{ChateId:chats.id,abId:req.params.id}})
      
      if(!chat){
        const chatAb = await ChatItem.create({ChateId: chatsAb.id, abId: user.id})
        chat = await ChatItem.create({ChateId:chats.id, abId: req.params.id})
        await Messages.create({ChatId:chatAb.id}) 
        await Messages.create({ChatId:chat.id})
      }
    
      console.log(chat)
      
    
      const messages = await Messages.findOne({where:{ChatId:chat.id}})
      console.log(messages)
      const message = await MessageItem.create({MessageId:messages.id,textMessage:req.body.text,speakerId:user.id})
      return res.json("Good")    
    }catch{
      return res.status(400).json("Error") 
    }
  }
  async getMessages(req,res,next){
    try{
      if(!req.cookies.access_token){
        return res.next(ApiError)
      }
      const token = req.cookies.access_token
      const decoded = jwt.verify(token, process.env.SECRET_KEY)
      const user = await User.findOne({where:{email: decoded.email}})
      const chats = await Chats.findOne({where:{userId:user.id}})
      const chat = await ChatItem.findOne({where:{ChateId:chats.id,abId:req.params.id}})
      if(!chat){
        return res.json([])
      }
      console.log(chat)
      const messages = await Messages.findOne({where:{ChatId:chat.id}})
      console.log(messages)
      const chatsAb = await Chats.findOne({where:{userId:req.params.id}})
      const chatAb = await ChatItem.findOne({where:{ChateId:chatsAb.id,abId:user.id}})
      const messagesAb = await Messages.findOne({where:{ChatId:chatAb.id}})
      const messageItems = await MessageItem.findAll({where:{MessageId:messages.id}})
      const messageItemsAb = await MessageItem.findAll({where:{MessageId:messagesAb.id}})
      let mesResponse = {}
      mesResponse.messages = messageItems
      console.log(messageItems)
      mesResponse.messages = mesResponse.messages.concat(messageItemsAb)
      console.log(mesResponse)
      mesResponse.messages.sort((a,b) => a.id - b.id)
      const abon = await User.findOne({where:{id:req.params.id}})
      mesResponse.abInfo = abon
      return res.json(mesResponse)
    }catch{
      return res.status(400).json("Error") 
    }
  }
  

}
module.exports = new MesContr()