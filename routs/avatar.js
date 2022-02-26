const Router =require('express')
const authMiddleware = require("../middleware/authMiddleware")
const router = new Router()
const fileController = require('../controllers/fileController')
router.post('/upload',authMiddleware, fileController.uploadFile)
router.get('/',authMiddleware, fileController.getDir) 
router.get('/download/:id',authMiddleware, fileController.downloadFile)


module.exports = router 