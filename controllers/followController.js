const ApiError = require('../error/ApiError')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {User,Followers,Followings, FollowersItem, FollowingItem} = require('../models/models')

class followCont{
  async createFollow(req,res,next){
    try{
      const token = req.cookies.access_token
      const decoded = jwt.verify(token, process.env.SECRET_KEY) 
      const subject = await User.findOne({where:{email:decoded.email}})
      const followings = await Followings.findOne({where:{userId: subject.id}})
      const followingsItem = await FollowingItem.findOne({where:{subjectId:req.params.id,FollowingId:followings.id}})
      if(followingsItem){
        return res.json("Good")
      }
      await FollowingItem.create({subjectId:req.params.id,FollowingId:followings.id})
      const object = await User.findOne({where:{id:req.params.id}})
      const followers = await Followers.findOne({where:{userId:object.id}}) 
      const followersItem = await FollowersItem.create({FollowerId:followers.id, objectId: subject.id})
      console.log(object,subject)
      return res.json("Good")
    }catch{
      return res.status(400).json("Error") 
    }
  }
  async delFollow(req,res,next){
    try{
    const token = req.cookies.access_token
    const decoded = jwt.verify(token, process.env.SECRET_KEY)
    const subject = await User.findOne({where:{email:decoded.email}})
    const followings = await Followings.findOne({where:{userId: subject.id}})
    const followingsItem = await FollowingItem.findOne({where:{subjectId:req.params.id,FollowingId:followings.id}})
    if(followingsItem){
      followingsItem.destroy()
    }
    const object = await User.findOne({where:{id:req.params.id}})
    const followers = await Followers.findOne({where:{userId:object.id}}) 
    const followersItem = await FollowersItem.findOne({where:{FollowerId:followers.id, objectId: subject.id}})
    if(followersItem){
      followersItem.destroy()
    }
    return res.json("Good")
    }catch{
      return res.status(400).json("Error") 
    }
  }
}
module.exports = new followCont()