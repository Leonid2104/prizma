const ApiError = require('../error/ApiError')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const fileService = require('../services/avaService')
const{User,Posts,Chats,Followers,Followings,FollowingItem,Avatar,FollowersItem} = require('../models/models')

const generateJwt =(id, email) => {
  return jwt.sign({id, email},
        process.env.SECRET_KEY,
        {expiresIn: '24h'})
      
}


class UserController{ 
    async authentication(req,res, next){
      if(!req.cookies.access_token){
        
        return res.json(false)
      }
      const token = req.cookies.access_token
      const decoded = jwt.verify(token, process.env.SECRET_KEY)
      if(!decoded){
        return res.json(false)
      }
      const user = await User.findOne({where:{email:decoded.email}})
      return res.json(user)
    }
    async registration(req, res, next){
      try{
        const {email, password} = req.body
        if (!email || !password || email.indexOf('@'|| req.body.userName == '') === -1){
          return next(ApiError.badRequest("Некорректный email или пароль"))
        }
        const candidate = await User.findOne({where: {email}})
        if (candidate){
          return next(ApiError.badRequest("Такой email уже зарегистрирован"))
        }
        const hashPassword = await bcrypt.hash(password, 5)
        const user = await User.create({email,password: hashPassword,userName:req.body.userName})
        const userId = user.id
        await Followings.create({userId: userId})
        await Followers.create({userId: userId})
        const posts = await Posts.create({userId: userId})
        await Chats.create({userId: userId})
        const avatar = await Avatar.create({userId: userId,path:`${user.id}`,parent:true})
        await fileService.createDirAva(req,avatar)
        await fileService.createDirPost(req,posts)

        
        const token = generateJwt(userId, user.email)
        return res.cookie("access_token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
        })
        .status(200)
        .json({token});
      }catch{
      return res.status(400).json("Error") 
    }
    }
    async login(req,res,next){
      try{
        const {email, password} = req.body
        if (!email || !password){
          return next(ApiError.internal('Пстые значения'))
        }
        const user = await User.findOne({where:{email:email}})
        if (!user) {
          return next(ApiError.internal('Пользователь не найден'))
        }
        let comparePassword = bcrypt.compareSync(password, user.password)
        if(!comparePassword){
          return next(ApiError.internal('Указан неверный пароль'))
        }
        const token = generateJwt(user.id, user.email)
        return res.cookie("access_token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
        })
        .status(200)
        .json({token});
      }catch{
      return res.status(400).json("Error") 
    }
    }
    async checkUsers(req,res,next){
      try{
        console.log(req.cookies)
        console.log(1111)
        const users = await User.findAll()
        const query = req.params
        if(req.cookies.access_token){
        const token = req.cookies.access_token
        const decoded = jwt.verify(token, process.env.SECRET_KEY)
        const log_user = await User.findOne({where:{email: decoded.email}})
          if (query.id){
            console.log(query.id)
            const userId =query.id
            let user = await User.findOne({where:{id: userId}})
            const followings = await Followings.findOne({where:{userId:log_user.id}})
            const following = await FollowingItem.findOne({where:{FollowingId:followings.id,subjectId:userId}})
            const followers = await Followers.findOne({where:{userId:log_user.id}})
            const follower = await FollowersItem.findOne({where:{FollowerId:followers.id,objectId:userId}})
            if(follower){
              user.dataValues.follower = true
            }else{
              user.dataValues.follower = false
            }
            if(following){
              user.dataValues.followed = true
            }else{
              user.dataValues.followed = false
            }
            console.log(user)
            return res.json(user)
          }
        
        const log_user_followings = await Followings.findOne({where:{userId:log_user.id}})
        let usersAns = users.slice(0)
        for (const i of usersAns){
          const following = await FollowingItem.findOne({where:{FollowingId: log_user_followings.id, subjectId: i.id}})
          if(following){
            i.dataValues.followed = true
          }else{
            i.dataValues.followed = false
          }
        }
        return res.json(usersAns)
        }
        if (query.id){
          console.log(query.id)
          const userId =query.id
          const user = await User.findOne({where: {id:userId}})
          return res.json(user)
        }
        
        return res.json(users)
      }catch{
      return res.status(400).json("Error") 
    }
    }
    async addName(req,res,next){
      try{
        const token = req.cookies.access_token
        const decoded = jwt.verify(token, process.env.SECRET_KEY)
        const user = await User.findOne({where:{email:decoded.email}})
        user.update({userName:req.body.userName})
        return res.json('Good')
      }catch{
        return res.status(400).json("Error") 
      }
    }
    async putStatus(req,res,next){
      try{
        const token = req.cookies.access_token
        const decoded = jwt.verify(token, process.env.SECRET_KEY)
        const user = await User.findOne({where:{email:decoded.email}})
        await user.update({status: req.body.text})
        return res.json('Good')
      }catch{
      return res.status(400).json("Error") 
    }
    }
    
}
module.exports = new UserController()