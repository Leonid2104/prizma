const ApiError = require('../error/ApiError')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {PostItem,Likes,LikeItem, User, Posts, Followings, FollowingItem} = require('../models/models')
const createAndUpdate = async(parId, uId) =>  {
  
}
class LikesController {
  async addLike(req,res,next){
    try{
      if(req.cookies.access_token){
      const token = req.cookies.access_token
      const decoded = jwt.verify(token, process.env.SECRET_KEY)
      const log_user = await User.findOne({where:{email: decoded.email}})
      if(!log_user){
        return next(ApiError.badRequest("Нет такого пользователя"))
      }
      
      const postItem = await PostItem.findOne({where:{id:req.params.id}}) 
      const likes = await Likes.findOne({where:{PostItemId:req.params.id}})
      
      const like = await LikeItem.findOne({where:{usId:log_user.id,LikeId:likes.id}})
      console.log(like)
      if(like){
        return next(ApiError.badRequest("Уже существует"))
      }
      await LikeItem.create({usId:log_user.id, LikeId:likes.id})
      const likesCount = await postItem.likes + 1
      await postItem.update({likes:likesCount})
      console.log(req.params.id,req.body.userId)
      return res.json("Good")
      }
      return next(ApiError.badRequest("Не авторизирован"))
    }catch{
      return res.status(400).json("Error") 
    }

  }
  async getUsersLikes(req,res,next){
    try{
      if(!req.cookies.access_token){
        return res.status(400).json("Не авторизирован")
      }
      const token = req.cookies.access_token
      const decoded = jwt.verify(token, process.env.SECRET_KEY)
      const user = await User.findOne({where:{email:decoded.email}})
      const posts = await Posts.findOne({where:{userId: user.id}})
      let likesAll = []
      const postItems = await PostItem.findAll({where:{PostId : posts.id}}) 
      
      for(let post in postItems){
        const likes = await Likes.findOne({where:{PostItemId: postItems[post].dataValues.id}})
        let likeItems = await LikeItem.findAll({where: {LikeId: likes.id}})
        for (let l in likeItems){
          likeItems[l].dataValues.postInfo = postItems[post]
        }
        likesAll = likesAll.concat(likeItems)
      }
      likesAll.sort((a,b) => b.id - a.id)

      console.log(likesAll)
      for (let like in likesAll ){
        const followings = await Followings.findOne({where:{userId: user.id}})
        const following = await FollowingItem.findOne({where:{FollowingId: followings.id,subjectId: likesAll[like].dataValues.usId}})
        if(following){
          likesAll[like].dataValues.followed = true
        }else{
          likesAll[like].dataValues.followed = false
        }
        const userCur = await User.findOne({where:{id: likesAll[like].dataValues.usId}})
        likesAll[like].dataValues.userInf = userCur
        
      }
      console.log(likesAll)
      return res.json(likesAll) 
    }catch{
      return res.status(400).json("Error") 
    }
  }
  async delLike(req,res,next){
    try{
      if(req.cookies.access_token){
      const token = req.cookies.access_token
      const decoded = jwt.verify(token, process.env.SECRET_KEY)
      
      const log_user = await User.findOne({where:{email: decoded.email}})
      if(!log_user){
        return next(ApiError.badRequest("Нет такого пользователя"))
      }
      const likes = await Likes.findOne({where:{PostItemId:req.params.id}})
      await LikeItem.destroy({where:{usId:log_user.id,LikeId:likes.id}})
      const post = await PostItem.findOne({where:{id:req.params.id}})
      const likesCount = post.likes - 1
      await post.update({likes:likesCount})
      return res.json("Good")
      }
      return next(ApiError.badRequest("Не авторизирован"))
    }catch{
      return res.status(400).json("Error") 
    }
  }
  async getLike(req,res,next){
    
  }
}
module.exports = new LikesController()