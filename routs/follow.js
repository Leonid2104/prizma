const Router =require('express')
const authMiddleware = require("../middleware/authMiddleware")
const router = new Router()
const followCont = require('../controllers/followController')
router.post('/:id',authMiddleware,followCont.createFollow)
router.get('/:id',) 
router.delete('/:id',authMiddleware,followCont.delFollow)


module.exports = router 