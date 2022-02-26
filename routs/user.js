const Router =require('express')
const router = new Router()
const UserController = require('../controllers/userController')
const authMiddleware = require('../middleware/authMiddleware')

router.post('/login',UserController.login)
router.post('/registration',UserController.registration)
router.get('/auth',UserController.authentication)
router.put('/status',authMiddleware,UserController.putStatus)
router.put('/name',authMiddleware,UserController.addName)





module.exports = router