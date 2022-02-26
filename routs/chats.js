const Router =require('express')
const authMiddleware = require("../middleware/authMiddleware")
const router = new Router()
const dialogsContr = require('../controllers/dialogsContr')
router.post('/:id',authMiddleware,dialogsContr.addChat)
router.get('/',authMiddleware,dialogsContr.getChats) 
router.delete('/:id',)


module.exports = router 