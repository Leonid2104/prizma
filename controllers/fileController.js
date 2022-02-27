const fileService = require('../services/avaService')
const config = require('config')
const fs = require('fs')
const {User,Avatar} = require('../models/models')
const jwt = require('jsonwebtoken')
class avaController {
  async createDir(req,res,next){
    try{
        const token = req.cookies.access_token
        const decoded = jwt.verify(token, process.env.SECRET_KEY) 
        const user = await User.findOne({where:{email:decoded.email}})
        const file = await Avatar.create({userId:user.id})
        await fileService.createDirAva(req,file)
    }catch(err){
      console.log(err)
      return res.status(400).json('Error')
    }
  }
  async getDir(req,res,next){
    try{
        const token = req.cookies.access_token
        const decoded = jwt.verify(token, process.env.SECRET_KEY) 
        const user = await User.findOne({where:{email:decoded.email}})
        const file = await Avatar.create({userId:user.id})
        return res.json(file)
    }catch(err){
      console.log(err)
      return res.status(400).json('Error')
    }
  }

  async uploadFile(req,res,next){
    try{
        const file =  req.files.file 
        if(!file){
          return res.status(400).json('Error')
        }
        const token = req.cookies.access_token
        const decoded = jwt.verify(token, process.env.SECRET_KEY) 
        if(!decoded){
          return res.status(400).json('Не авторизирован')
        }
        const user = await User.findOne({where:{email:decoded.email}})
        console.log(file)
        const type = file.name.split('.').pop()
        let path = `${req.filePath}\\avatars\\${user.id}\\${user.id}_avatar.${type}`
        const avatar = await Avatar.findOne({where:{userId: user.id, parent:false}})
        if (avatar){
          let pathDel = `${req.filePath}\\avatars\\${user.id}\\${user.id}_avatar.${avatar.type}`
          fs.unlinkSync(pathDel)
          await avatar.destroy()
        }
        file.mv(path)
        const dbFile = await Avatar.create({size:file.size, path:`${user.id}\\${user.id}_avatar.${type}`,userId: user.id,type:type})
        await user.update({avatar:`\\avatars\\${dbFile.userId}\\${dbFile.userId}_avatar.${type}`})
        console.log(user)
        return res.json(dbFile)
    }catch(err){
      console.log(err)
      return res.status(400).json('Error')
    }
  }
  async downloadFile(req,res,next){
    try{
        const token = req.cookies.access_token
        
        const decoded = jwt.verify(token, process.env.SECRET_KEY) 
        if(!decoded){
          return res.status(400).json('Error')
        }
        console.log(req.params.id)
        const file = await Avatar.findOne({where:{parent:false,userId:req.params.id}})
        if(!file){
          return res.json(null)
        }
        let path = `${config.get('filePathAva')}//${file.path}`
        console.log(111111)
        if(fs.existsSync(path)){
          console.log()
          return res.json(file.path)
        }
        return res.json('NO')
    }catch(err){
      console.log(err)
      return res.status(400).json('Error')
    }
  }
}

module.exports = new avaController