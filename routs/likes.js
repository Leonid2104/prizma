const Router =require('express')
const { delLike } = require('../controllers/likesController')
const authMiddleware = require("../middleware/authMiddleware")
const router = new Router()
const likesController = require('../controllers/likesController')
router.post('/:id',authMiddleware,likesController.addLike)
router.get('/',authMiddleware,likesController.getUsersLikes) 
router.delete('/:id',authMiddleware,delLike)


module.exports = router 