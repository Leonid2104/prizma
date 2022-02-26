const fs = require('fs')
const {Avatar} = require('../models/models')
const config = require('config')
class FileService {
  createDirAva(req,file){ 
    return new Promise(((resolve,reject) => {
      const filePath = `${req.filePath}\\avatars\\${file.userId}`
      try{
        console.log(filePath)
        if(!fs.existsSync(filePath)){
          fs.mkdirSync(filePath)
          return resolve({message:'Good job'})
        }else{
          return reject('Файл существует')
        }
        
      }catch(e){
        return reject('error')
      }
    }))
  }
  createDirPost(req,file){ 
    return new Promise(((resolve,reject) => {
      const filePath = `${req.filePath}\\posts\\${file.userId}`
      try{
        console.log(filePath)
        if(!fs.existsSync(filePath)){
          fs.mkdirSync(filePath)
          return resolve({message:'Good job'})
        }else{
          return reject('Файл существует')
        }
        
      }catch(e){
        return reject('error')
      }
    }))
  }
  createDirInDirPost(req,file){ 
    return new Promise(((resolve,reject) => {
      const filePath = `${req.filePath}\\posts\\${file.userId}\\${file.id}`
      try{
        console.log(filePath)
        if(!fs.existsSync(filePath)){
          fs.mkdirSync(filePath)
          return resolve({message:'Good job'})
        }else{
          return reject('Файл существует')
        }
        
      }catch(e){
        return reject('error')
      }
    }))
  }
}

module.exports = new FileService()