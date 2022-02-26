const ApiError = require('../error/ApiError')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const {MessageItem,Messages,Chats,ChatItem,User} = require('../models/models')
class DialogsContr{
  async addChat(req,res,next){
    try{
      const token = req.cookies.access_token
      const decoded = jwt.verify(token, process.env.SECRET_KEY)
      const user = await User.findOne({where:{email: decoded.email}})
      const chats = await Chats.findOne({where:{userId:user.id}})
      const chat = await ChatItem.findOne({where:{ChateId:chats.id,abId:req.params.id}})

      if(!chat){
        const chatIt = await ChatItem.create({ChateId:chats.id,abId:req.params.id})
        const messages = await Messages.create({ChatId: chatIt.id})
        const chatsAb = await Chats.findOne({where:{userId: req.params.id}})
        const chatItAb = await ChatItem.create({ChateId: chatsAb.id,abId:user.id})
        const messagesAb = await Messages.create({ChatId: chatItAb.id})
      }  
      return res.json("Good")  
    }catch{
      return res.status(400).json("Error") 
    }
  }
  async getChats(req,res,next){
    try{
    const token = req.cookies.access_token
    const decoded = jwt.verify(token, process.env.SECRET_KEY)
    const user = await User.findOne({where:{email: decoded.email}})
    const chat = await Chats.findOne({where:{userId: user.id}})
    console.log(chat)
    const chats = await ChatItem.findAll({where:{ChateId: chat.id}})
    if(!chats){
      return res.json([])
    }
    for(let ch of chats){
      let ab = await User.findOne({where: {id: ch.dataValues.abId}})
      ch.dataValues.userInfo = ab
    }
    
    return res.json(chats)
  }
  catch{
      return res.status(400).json("Error") 
    }}
}
module.exports = new DialogsContr()