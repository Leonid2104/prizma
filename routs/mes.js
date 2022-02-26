const Router =require('express')
const authMiddleware = require("../middleware/authMiddleware")
const router = new Router()
const mesController = require('../controllers/mesController')
router.post('/:id',authMiddleware,mesController.addMessage)
router.get('/:id',authMiddleware,mesController.getMessages) 
router.delete('/:id',)


module.exports = router 