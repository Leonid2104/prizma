const Router = require('express')

const userRouter =require('./user')
const postsRouter =require('./posts')
const usersRouter =require('./users')
const likesRouter =require('./likes')
const dialogRouter =require('./chats')
const messagesRouter =require('./mes')
const followRouter =require('./follow')
const avatarRouter =require('./avatar')
const router = new Router()


router.use('/user', userRouter)
router.use('/users', usersRouter)
router.use('/posts', postsRouter)
router.use('/likes', likesRouter)
router.use('/dialogs', dialogRouter)
router.use('/messages', messagesRouter)
router.use('/follow', followRouter)
router.use('/avatar', avatarRouter)



module.exports = router