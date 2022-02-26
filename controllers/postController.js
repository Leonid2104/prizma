const ApiError = require('../error/ApiError')
const bcrypt = require('bcryptjs')
const config = require('config')
const fs = require('fs')
const avaService = require('../services/avaService')
const {PostItem,Posts,Likes,User, LikeItem,Followings,FollowingItem} = require('../models/models')
const jwt = require('jsonwebtoken')
class PostController {
  async addPost(req,res,next){
    try{
      const text = req.body.text
      console.log(text)
      if (!req.cookies.access_token){
        return next(ApiError.badRequest("Не авторизирован"))
      }
      const token = req.cookies.access_token
      const decoded = jwt.verify(token, process.env.SECRET_KEY)
      const user = await User.findOne({where:{email:decoded.email}})
      const ID = user.id
      if(!ID){
        return next(ApiError.badRequest("Неверно введён id"))
      }
      console.log(ID)
      const post =  await Posts.findOne({where:{userId : ID}})
      console.log(post)
      if(!post){
        return next(ApiError.badRequest("Нет такого пользователя"))
      }
      const postItem = await PostItem.create({txt: text, likes:0,PostId:post.id }) 
      let locPostItem =postItem
      await Likes.create({PostItemId: postItem.id}) 
      locPostItem.userId = ID
      if(!fs.existsSync(`${req.filePath}\\posts/${user.id}`)){
        await avaService.createDirPost(req,post)
      }
      await avaService.createDirInDirPost(req,postItem)
      
      return res.json(postItem)
    }catch{
      return res.status(400).json("Error") 
    }
  }
  async checkPosts(req,res,next){
    try{
      if (!req.cookies.access_token){
        return next(ApiError.badRequest("Не авторизирован"))
      }
      const token = req.cookies.access_token
      const decoded = jwt.verify(token, process.env.SECRET_KEY)
      const user = await User.findOne({where:{email:decoded.email}})
      const ID = req.params.id
      if(!ID){
        return next(ApiError.badRequest("Неверно введён id"))
      }
      const post =  await Posts.findOne({where:{userId : ID}})
      if(!post){
        return next(ApiError.badRequest("Нет такого пользователя"))
      }
      let posts = await PostItem.findAll({where:{PostId: post.id}})
      if(!posts){
        console.log(1111)
      }
      console.log(posts)
      let i =0  
      for(const pos in posts){
        posts[pos].dataValues.oneUserId = i
        i++
        console.log(posts[pos].dataValues)
        posts[pos].dataValues
        const likes = await Likes.findOne({where:{PostItemId:posts[pos].dataValues.id}})
        console.log(likes)
        
        const like = await LikeItem.findOne({where:{LikeId: likes.id,usId:user.id}})
        
        if(like){
          posts[pos].dataValues.liked = true
          posts[pos].dataValues.path = req.filePath
        }
        else{
          posts[pos].dataValues.liked = false
          posts[pos].dataValues.path = req.filePath
        }
      }
      posts.sort((a,b) => b.id - a.id)
      
      return res.json(posts)
    }catch{
      return res.status(400).json("Error") 
    }
  }
  async delPost(req,res,next){
    try{
      if (!req.cookies.access_token){
        return next(ApiError.badRequest("Не авторизирован"))
      }
      const token = req.cookies.access_token
      const decoded = jwt.verify(token, process.env.SECRET_KEY)
      const postId =req.params.postId
      const post = await PostItem.findOne({where:{id:postId}})
      const likes = await Likes.findOne({where:{PostItemId:post.id}})
      const like = await LikeItem.findAll({where:{LikeId:likes.id}})
      let length = like.length
      for (let l in like){
        await like[length - 1 -l].destroy()
      }
      await likes.destroy()
      await post.destroy()
      if(post.linkToPhoto){
        let pathDel = `${req.filePath}\\posts\\${post.linkToPhoto}`
        fs.unlinkSync(pathDel) 
        let index = pathDel.lastIndexOf('/') > pathDel.lastIndexOf("\\") ? pathDel.lastIndexOf('/'): pathDel.lastIndexOf('\\') 
        if(index != -1){
          let pathDirDel =  pathDel.slice(0,index)
          console.log(pathDirDel)
          fs.rmdirSync(pathDirDel, { recursive: true })

        }
      }
      return res.json('Good')
    }catch{
      return res.status(400).json("Непредвиденная ошибка!")
    }
  }
  async updatePost(req,res,next){
    try{
      const usId = req.params.userId
      console.log(req.params)
      const postId =req.params.postId
      const posts = await Posts.findOne({where:{userId: usId}})
      const text = req.body.text
      const post = await PostItem.findOne({where:{PostId:posts.id, id:postId}})
      post.update({txt:text})
      return res.json(post)
    }catch{
      return res.status(400).json("Error") 
    }
  }
  async getNews(req,res,next){
    try{
      if (!req.cookies.access_token){
        return next(ApiError.badRequest("Не авторизирован"))
      }
      const token = req.cookies.access_token
      const decoded = jwt.verify(token, process.env.SECRET_KEY)
      const user = await User.findOne({where:{email:decoded.email}})
      const following = await Followings.findOne({where:{userId:user.id}})
      const followings = await FollowingItem.findAll({where:{FollowingId:user.id}})
      let posts = []
      for(let fol in followings){
        const postsOne = await Posts.findOne({where:{userId:followings[fol].subjectId}})
        const postsAll = await PostItem.findAll({where:{PostId:postsOne.id}})
        posts = posts.concat(postsAll)
      }

      let i =0
      posts.sort((a, b) => b.id - a.id)
      for(const pos in posts){
        posts[pos].dataValues.localPostId = i
        i++
        const post = await Posts.findOne({where:{id:posts[pos].PostId}})
        posts[pos].dataValues.userId = post.userId 
        const likes = await Likes.findOne({where:{PostItemId:posts[pos].dataValues.id}})
        const like = await LikeItem.findOne({where:{LikeId: likes.id,usId:user.id}})
        console.log(like)
        if(like){
          posts[pos].dataValues.liked = true
        }
        else{
          posts[pos].dataValues.liked = false
        }
      }
      return res.json(posts)
    }catch{
      return res.status(400).json("Error") 
    }
  }
  async addPhotoPost(req,res,next){
    try{
      const file = req.files.file
      const token = req.cookies.access_token
      const decoded = jwt.verify(token, process.env.SECRET_KEY)
      if (!decoded){
        return res.status(400).json('НЕ АВТОРИЗИРОВАН!')
      }
      const user = await User.findOne({where:{email:decoded.email}})
      const type = file.name.split('.').pop()
      const post = await PostItem.findOne({where:{id:req.params.id}})
      let path = `${req.filePath}\\posts\\${user.id}\\${post.id}\\${post.id}_post.${type}`
      if(post.linkToPhoto){
        const typeDel = post.linkToPhoto.split('.').pop()
        console.log(typeDel)
        let pathDel = `${req.filePath}\\posts\\${user.id}\\${post.id}\\${post.id}_post.${typeDel}` 
        console.log(pathDel)
        fs.unlinkSync(pathDel) 
      }    
      const link = `\\${user.id}\\${post.id}\\${post.id}_post.${type}`
      await post.update({linkToPhoto: link})
      file.mv(path)
      return res.json('Good')
    }catch{
      return res.status(400).json("Error") 
    }
  }
}
module.exports = new PostController()