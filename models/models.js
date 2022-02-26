const sequelize = require('../db')
const {DataTypes} = require('sequelize')
const User = sequelize.define( 'user',{
  id : {type : DataTypes.INTEGER , primaryKey: true, autoIncrement : true},
  email : {type: DataTypes.STRING, unique : true},
  password : {type: DataTypes.STRING},  
  status : {type: DataTypes.STRING},
  userName : {type: DataTypes.STRING},
  avatar :{type: DataTypes.STRING}
})
const Users = sequelize.define("Users",{
  id : {type : DataTypes.INTEGER , primaryKey: true, autoIncrement : true},
})

const Posts = sequelize.define("Posts",{
  id : {type : DataTypes.INTEGER , primaryKey: true, autoIncrement : true},

})

const PostItem = sequelize.define("PostItem",{
  id : {type : DataTypes.INTEGER , primaryKey: true, autoIncrement : true},
  txt :{type : DataTypes.STRING},
  likes : {type: DataTypes.INTEGER},
  linkToPhoto:{type: DataTypes.STRING}
})

const Likes = sequelize.define("Likes",{
  id : {type : DataTypes.INTEGER , primaryKey: true, autoIncrement : true},
})

const LikeItem = sequelize.define("LikeItem",{
  id : {type : DataTypes.INTEGER , primaryKey: true, autoIncrement : true},
  usId : {type : DataTypes.INTEGER , primaryKey: true},
})

const Followers = sequelize.define('Followers',{
  id: {type: DataTypes.INTEGER,primaryKey:true, autoIncrement: true}
})

const FollowersItem = sequelize.define('FollowersItem',{
  id: {type: DataTypes.INTEGER, primaryKey: true,autoIncrement: true},
  objectId:{type: DataTypes.INTEGER}
})

const Followings = sequelize.define('Followings',{
  id: {type: DataTypes.INTEGER, primaryKey: true,autoIncrement: true}
})

const FollowingItem = sequelize.define('FollowingItem',{
  id: {type: DataTypes.INTEGER, primaryKey: true,autoIncrement: true},
  subjectId:{type: DataTypes.INTEGER}
})

const Chats = sequelize.define('Chates',{
  id: {type: DataTypes.INTEGER, primaryKey: true,autoIncrement: true}
})

const ChatItem = sequelize.define('Chat',{
  id: {type: DataTypes.INTEGER, primaryKey: true,autoIncrement: true},
  abId:{type: DataTypes.INTEGER}
})

const Messages = sequelize.define('Messages',{
  id: {type: DataTypes.INTEGER, primaryKey: true,autoIncrement: true},
})

const MessageItem = sequelize.define('MessageItem',{
  id: {type: DataTypes.INTEGER, primaryKey: true,autoIncrement: true},
  textMessage : {type: DataTypes.STRING},
  speakerId : {type: DataTypes.INTEGER}
})

const Avatar = sequelize.define('Avatar',{
  id:{type: DataTypes.INTEGER, primaryKey: true,autoIncrement: true},
  accessLink : {type: DataTypes.STRING,},
  size : {type: DataTypes.INTEGER, unique : false,defaultValue: 0},
  path : {type: DataTypes.STRING, defaultValue: ''},
  userId:{type: DataTypes.INTEGER},
  parent: {type: DataTypes.BOOLEAN, defaultValue: false},
  type:{type:DataTypes.STRING}
})
/*Users.hasMany(User)
User.belongsTo(Users)*/
User.hasOne(Posts)
Posts.belongsTo(User)

User.hasOne(Avatar)
Avatar.belongsTo(User)

User.hasOne(Followers)
Followers.belongsTo(User)

User.hasOne(Followings)
Followings.belongsTo(User)

User.hasOne(Chats)
Chats.belongsTo(User)

Followers.hasMany(FollowersItem)
FollowersItem.belongsTo(Followers)

Followings.hasMany(FollowingItem)
FollowingItem.belongsTo(Followings)

Posts.hasMany(PostItem)
PostItem.belongsTo(Posts)

PostItem.hasOne(Likes)
Likes.belongsTo(PostItem)

Likes.hasMany(LikeItem)
LikeItem.belongsTo(Likes)



Chats.hasMany(ChatItem)
ChatItem.belongsTo(Chats)

ChatItem.hasOne(Messages)
Messages.belongsTo(ChatItem)

Messages.hasMany(MessageItem)
MessageItem.belongsTo(Messages)

module.exports = {
  Posts,
  PostItem,
  Likes,
  LikeItem,
  User, 
  Followers, 
  Followings, 
  Chats, 
  ChatItem, 
  Messages, 
  MessageItem,
  FollowersItem,
  FollowingItem,
  Users,
  Avatar
}