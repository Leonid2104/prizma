const Router =require('express')
const router = new Router()
const authMiddleware = require("../middleware/authMiddleware")
const userController = require('../controllers/userController')


router.get('/',userController.checkUsers)
router.get('/:id',authMiddleware,userController.checkUsers)



module.exports = router